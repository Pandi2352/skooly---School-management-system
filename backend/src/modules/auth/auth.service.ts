import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { findWeakPasswordReason, hashPassword, verifyPassword } from '../../common/utils/password.util'
import { generateSecretToken, hashSecretToken } from '../../common/utils/token.util'
import type { AuthEnvConfig } from '../../config/env.config'
import { AuditService } from '../audit/audit.service'
import { MailService } from '../mail/mail.service'
import type { RoleResponseDto } from '../roles/dto/role-response.dto'
import { RolesService } from '../roles/roles.service'
import type { UserSessionResponseDto } from '../users/dto/user-response.dto'
import { toSessionResponse, toUserResponse } from '../users/users.mapper'
import { UserRecord, UsersRepository } from '../users/users.repository'
import { cleanEmail, cleanFullName, emailKey } from '../users/utils/user.util'
import {
  accountArchived,
  accountLocked,
  accountSuspended,
  administratorRoleMissing,
  currentPasswordWrong,
  invalidCredentials,
  passwordUnchanged,
  sessionNotFound,
  setupAlreadyDone,
  tokenAlreadyUsed,
  tokenExpired,
  tokenInvalid,
  weakPassword,
} from './auth.errors'
import type { TokenPurpose } from './constants/auth.constants'
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  SetPasswordWithTokenDto,
  SetupDto,
} from './dto/auth-request.dto'
import {
  PasswordChangedResponseDto,
  SetupStateDto,
  SignedInUserDto,
  TokenCheckDto,
} from './dto/auth-response.dto'
import { SessionsRepository } from './sessions/sessions.repository'
import { UserTokenRecord, UserTokensRepository } from './tokens/user-tokens.repository'

/** What the request can tell us about the browser signing in. */
export type SignInContext = {
  userAgent: string
  ip: string
}

export type IssuedSession = {
  /** The value to put in the cookie. Held only long enough to send; the database keeps its hash. */
  token: string
  expiresAt: Date
  sessionId: string
}

export type SignInResult = { account: SignedInUserDto; session: IssuedSession }

/**
 * Signing in, signing out and everything about one's own password. It answers the same way for an
 * unknown email as for a wrong password, so this endpoint can't be used to find out who works here.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  /** Built once, on the first sign-in attempt for an email that has no account. */
  private decoy: Promise<string> | null = null

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly tokensRepository: UserTokensRepository,
    private readonly rolesService: RolesService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
    private readonly configService: ConfigService,
  ) {}

  private get auth(): AuthEnvConfig {
    return this.configService.getOrThrow<AuthEnvConfig>('auth')
  }

  /** True while the school has no accounts, which is the only time /auth/setup works. */
  async getSetupState(): Promise<SetupStateDto> {
    return { needsSetup: (await this.usersRepository.countAll()) === 0 }
  }

  /** Creates the school's first administrator and signs them in. */
  async setup(dto: SetupDto, context: SignInContext): Promise<SignInResult> {
    if ((await this.usersRepository.countAll()) > 0) throw setupAlreadyDone()

    const role = await this.rolesService.findAdministratorRole()
    if (!role) throw administratorRoleMissing()

    const email = cleanEmail(dto.email)
    const fullName = cleanFullName(dto.fullName)
    const reason = findWeakPasswordReason(dto.password, { email, fullName })
    if (reason) throw weakPassword(reason, 'password')

    const now = new Date()
    const user = await this.usersRepository.create({
      fullName,
      email,
      emailKey: emailKey(email),
      phone: '',
      designation: dto.designation ?? '',
      roleId: role.id,
      status: 'active',
      createdBy: null,
      passwordHash: await hashPassword(dto.password),
      passwordUpdatedAt: now,
      mustChangePassword: false,
      activatedAt: now,
    })
    this.logger.log(`First administrator created: ${user.email}`)
    await this.auditService.record('auth.setup_completed', {
      actor: { id: user._id, name: user.fullName },
      targetUserId: user._id,
      targetName: user.fullName,
      summary: `${role.name} account created during first-run setup`,
      ...context,
    })
    return this.startSession(user, role, context, false)
  }

  async login(dto: LoginDto, context: SignInContext): Promise<SignInResult> {
    const user = await this.usersRepository.findByEmailKey(emailKey(dto.email))
    if (!user) {
      // Hash anyway: answering instantly for unknown emails would show which ones exist.
      await verifyPassword(await this.decoyHash(), dto.password)
      await this.auditService.record('auth.login_failed', {
        summary: `No account for ${dto.email}`,
        ...context,
      })
      throw invalidCredentials()
    }

    const now = new Date()
    if (user.lockedUntil && new Date(user.lockedUntil) > now) {
      await this.auditService.record('auth.login_failed', {
        targetUserId: user._id,
        targetName: user.fullName,
        summary: 'Tried to sign in while locked',
        ...context,
      })
      throw accountLocked(Math.max(1, Math.ceil((new Date(user.lockedUntil).getTime() - now.getTime()) / 60_000)))
    }

    // An invited account has no password yet, so nothing can match it.
    const passwordMatches = user.passwordHash !== '' && (await verifyPassword(user.passwordHash, dto.password))
    if (!passwordMatches) {
      await this.recordFailure(user, context)
      throw invalidCredentials()
    }

    // Only once the password is right is it safe to say why an account can't be used: by then we
    // are talking to its owner.
    if (user.status === 'suspended') throw accountSuspended()
    if (user.status === 'archived') throw accountArchived()

    await this.usersRepository.recordSuccessfulLogin(user._id, now)
    await this.auditService.record('auth.login', {
      actor: { id: user._id, name: user.fullName },
      targetUserId: user._id,
      targetName: user.fullName,
      ...context,
    })
    const role = await this.rolesService.findByIdOrNull(user.roleId)
    return this.startSession({ ...user, lastLoginAt: now, failedLoginCount: 0, lockedUntil: null }, role, context, dto.rememberMe ?? false)
  }

  /** Who the signed-in person is, re-read from the database so a role change shows up at once. */
  async getCurrentAccount(actor: AuthenticatedUserContext): Promise<SignedInUserDto> {
    const user = await this.usersRepository.findById(actor.id)
    if (!user) throw sessionNotFound()
    const role = await this.rolesService.findByIdOrNull(user.roleId)
    const session = actor.sessionId ? await this.sessionsRepository.findById(actor.sessionId) : null
    return this.describeAccount(user, role, session?.idleExpiresAt ?? new Date())
  }

  async logout(actor: AuthenticatedUserContext): Promise<void> {
    if (actor.sessionId) await this.sessionsRepository.revokeById(actor.sessionId, 'Signed out')
    await this.auditService.record('auth.logout', {
      actor,
      targetUserId: actor.id,
      targetName: actor.fullName ?? '',
    })
  }

  async changePassword(actor: AuthenticatedUserContext, dto: ChangePasswordDto): Promise<PasswordChangedResponseDto> {
    const user = await this.usersRepository.findById(actor.id)
    if (!user) throw sessionNotFound()

    const currentMatches = user.passwordHash !== '' && (await verifyPassword(user.passwordHash, dto.currentPassword))
    if (!currentMatches) throw currentPasswordWrong()
    if (dto.currentPassword === dto.newPassword) throw passwordUnchanged()

    const reason = findWeakPasswordReason(dto.newPassword, { email: user.email, fullName: user.fullName })
    if (reason) throw weakPassword(reason)

    const changedAt = new Date()
    await this.usersRepository.updateById(user._id, {
      passwordHash: await hashPassword(dto.newPassword),
      passwordUpdatedAt: changedAt,
      mustChangePassword: false,
      failedLoginCount: 0,
      lockedUntil: null,
    })
    // Anyone else already signed in as this person loses access; this device stays signed in.
    const otherSessionsEnded = await this.sessionsRepository.revokeAllForUser(user._id, 'Password changed', actor.sessionId)
    const emailSent = await this.mailService.sendPasswordChanged({ to: user.email, fullName: user.fullName, changedAt })
    await this.auditService.record('auth.password_changed', {
      actor,
      targetUserId: user._id,
      targetName: user.fullName,
      summary:
        otherSessionsEnded > 0
          ? `${otherSessionsEnded} other ${otherSessionsEnded === 1 ? 'session' : 'sessions'} ended`
          : '',
    })
    return { otherSessionsEnded, emailSent }
  }

  /**
   * Always answers the same way. Saying "no such account" here would turn the form into a way of
   * checking who has an account at the school.
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersRepository.findByEmailKey(emailKey(dto.email))
    if (!user || user.status === 'archived' || user.status === 'suspended') return

    const { token, tokenHash } = generateSecretToken()
    const expiresInMinutes = this.auth.resetExpiryMinutes
    await this.tokensRepository.invalidateOpenTokens(user._id, 'password_reset')
    await this.tokensRepository.create({
      userId: user._id,
      purpose: 'password_reset',
      tokenHash,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60_000),
      createdBy: null,
    })
    await this.mailService.sendPasswordReset({
      to: user.email,
      fullName: user.fullName,
      actionUrl: this.buildLink('password_reset', token),
      expiresInMinutes,
    })
    await this.auditService.record('auth.password_reset_requested', {
      targetUserId: user._id,
      targetName: user.fullName,
      summary: 'Asked for it themselves',
    })
  }

  /** Checks a link from an email before showing the password form, so mistakes are caught early. */
  async checkToken(token: string): Promise<TokenCheckDto> {
    const { record, user } = await this.readToken(token)
    return {
      purpose: record.purpose,
      fullName: user.fullName,
      email: user.email,
      expiresAt: new Date(record.expiresAt).toISOString(),
    }
  }

  /**
   * Finishes an invitation or a reset. The person proved they can read that mailbox, so they are
   * signed in straight away, and every earlier session of theirs is ended in case it wasn't theirs.
   */
  async setPasswordWithToken(dto: SetPasswordWithTokenDto, context: SignInContext): Promise<SignInResult> {
    const { record, user } = await this.readToken(dto.token)

    const reason = findWeakPasswordReason(dto.password, { email: user.email, fullName: user.fullName })
    if (reason) throw weakPassword(reason, 'password')

    // Whoever marks the link used first wins; a second request with the same link is refused.
    if (!(await this.tokensRepository.markUsed(record._id))) throw tokenAlreadyUsed()

    const now = new Date()
    const updated = await this.usersRepository.updateById(user._id, {
      passwordHash: await hashPassword(dto.password),
      passwordUpdatedAt: now,
      mustChangePassword: false,
      failedLoginCount: 0,
      lockedUntil: null,
      status: user.status === 'invited' ? 'active' : user.status,
      activatedAt: user.activatedAt ?? now,
      lastLoginAt: now,
    })
    const account = updated ?? user
    await this.sessionsRepository.revokeAllForUser(account._id, 'Password changed')
    if (record.purpose === 'password_reset') {
      await this.mailService.sendPasswordChanged({ to: account.email, fullName: account.fullName, changedAt: now })
    }

    await this.auditService.record('auth.password_set_from_link', {
      actor: { id: account._id, name: account.fullName },
      targetUserId: account._id,
      targetName: account.fullName,
      summary: record.purpose === 'invitation' ? 'Accepted an invitation' : 'Used a password reset link',
      ...context,
    })

    const role = await this.rolesService.findByIdOrNull(account.roleId)
    return this.startSession(account, role, context, false)
  }

  async listOwnSessions(actor: AuthenticatedUserContext): Promise<UserSessionResponseDto[]> {
    const sessions = await this.sessionsRepository.findLiveByUser(actor.id, new Date())
    return sessions.map((session) => toSessionResponse(session, actor.sessionId))
  }

  async revokeOwnSession(actor: AuthenticatedUserContext, sessionId: string): Promise<void> {
    const session = await this.sessionsRepository.findById(sessionId)
    // Someone else's session id must look exactly like one that has already ended.
    if (!session || session.userId !== actor.id || session.revokedAt) throw sessionNotFound()
    await this.sessionsRepository.revokeById(sessionId, 'Signed out from another device')
  }

  async revokeOtherSessions(actor: AuthenticatedUserContext): Promise<number> {
    return this.sessionsRepository.revokeAllForUser(actor.id, 'Signed out from another device', actor.sessionId)
  }

  private async recordFailure(user: UserRecord, context: SignInContext): Promise<void> {
    const attemptsSoFar = user.failedLoginCount + 1
    const shouldLock = attemptsSoFar >= this.auth.loginMaxAttempts
    const lockedUntil = shouldLock ? new Date(Date.now() + this.auth.loginLockMinutes * 60_000) : null
    await this.usersRepository.recordFailedLogin(user._id, lockedUntil)
    await this.auditService.record(shouldLock ? 'auth.locked' : 'auth.login_failed', {
      targetUserId: user._id,
      targetName: user.fullName,
      summary: shouldLock
        ? `Locked for ${this.auth.loginLockMinutes} minutes after ${attemptsSoFar} wrong passwords`
        : `Wrong password (${attemptsSoFar} in a row)`,
      ...context,
    })
    if (shouldLock) {
      this.logger.warn(`Account locked after ${attemptsSoFar} wrong passwords: ${user.email}`)
    }
  }

  /**
   * A real hash to check a password against when the email is unknown. Without it the answer comes
   * back far quicker for addresses that have no account, and a list of staff emails can be built
   * one guess at a time.
   */
  private decoyHash(): Promise<string> {
    this.decoy ??= hashPassword(generateSecretToken().token)
    return this.decoy
  }

  private async readToken(token: string): Promise<{ record: UserTokenRecord; user: UserRecord }> {
    const record = await this.tokensRepository.findByTokenHash(hashSecretToken(token))
    if (!record) throw tokenInvalid()
    if (record.usedAt) throw tokenAlreadyUsed()
    if (new Date(record.expiresAt) <= new Date()) throw tokenExpired()

    const user = await this.usersRepository.findById(record.userId)
    if (!user || user.status === 'archived') throw tokenInvalid()
    return { record, user }
  }

  private async startSession(
    user: UserRecord,
    role: RoleResponseDto | null,
    context: SignInContext,
    rememberMe: boolean,
  ): Promise<SignInResult> {
    const now = new Date()
    const { token, tokenHash } = generateSecretToken()
    const idleMinutes = rememberMe ? this.auth.rememberMeIdleDays * 24 * 60 : this.auth.sessionIdleMinutes
    const absoluteExpiresAt = new Date(now.getTime() + this.auth.sessionAbsoluteDays * 24 * 3_600_000)
    const idleExpiresAt = new Date(Math.min(now.getTime() + idleMinutes * 60_000, absoluteExpiresAt.getTime()))

    const session = await this.sessionsRepository.create({
      userId: user._id,
      tokenHash,
      userAgent: context.userAgent.slice(0, 300),
      ip: context.ip,
      rememberMe,
      lastSeenAt: now,
      idleExpiresAt,
      absoluteExpiresAt,
    })

    return {
      account: this.describeAccount(user, role, idleExpiresAt),
      session: { token, expiresAt: absoluteExpiresAt, sessionId: session._id },
    }
  }

  private describeAccount(user: UserRecord, role: RoleResponseDto | null, sessionExpiresAt: Date): SignedInUserDto {
    return {
      user: toUserResponse(user, role ? { id: role.id, name: role.name, fullAccess: role.fullAccess } : null),
      permissions: role?.permissions ?? [],
      fullAccess: role?.fullAccess ?? false,
      mustChangePassword: user.mustChangePassword,
      sessionExpiresAt: new Date(sessionExpiresAt).toISOString(),
    }
  }

  private buildLink(purpose: TokenPurpose, token: string): string {
    const appUrl = this.configService.get<{ appUrl: string }>('app')?.appUrl ?? 'http://localhost:5173'
    const path = purpose === 'invitation' ? '/set-password' : '/reset-password'
    return `${appUrl}${path}?token=${encodeURIComponent(token)}`
  }
}
