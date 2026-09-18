import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { isDuplicateKeyError } from '../../common/utils/mongo-error.util'
import { findWeakPasswordReason, generateTemporaryPassword, hashPassword } from '../../common/utils/password.util'
import { generateSecretToken } from '../../common/utils/token.util'
import type { AppEnvConfig, AuthEnvConfig } from '../../config/env.config'
import type { AuditEventResponseDto } from '../audit/dto/audit-response.dto'
import { AuditService } from '../audit/audit.service'
import type { TokenPurpose } from '../auth/constants/auth.constants'
import { SessionsRepository } from '../auth/sessions/sessions.repository'
import { UserTokensRepository } from '../auth/tokens/user-tokens.repository'
import type { RoleResponseDto } from '../roles/dto/role-response.dto'
import { RolesService } from '../roles/roles.service'
import { MailService } from '../mail/mail.service'
import { ChangeUserRoleDto } from './dto/change-user-role.dto'
import { ChangeUserStatusDto } from './dto/change-user-status.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { ListUsersQueryDto } from './dto/list-users-query.dto'
import { SetTemporaryPasswordDto } from './dto/set-temporary-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import {
  CreatedUserResponseDto,
  InvitationSentResponseDto,
  SessionsEndedResponseDto,
  TemporaryPasswordResponseDto,
  UserListMetaDto,
  UserResponseDto,
  UserRoleSummaryDto,
  UserSessionResponseDto,
} from './dto/user-response.dto'
import {
  alreadyActivated,
  archivedAccount,
  cannotGrantFullAccess,
  cannotModifySelf,
  emailBelongsToArchivedAccount,
  emailTaken,
  lastAdministrator,
  noUserChanges,
  roleNotFound,
  roleUnchanged,
  statusUnchanged,
  twoFactorNotOn,
  userNotFound,
  weakPassword,
} from './users.errors'
import { toSessionResponse, toUserListMeta, toUserResponse } from './users.mapper'
import { UserChanges, UserRecord, UsersRepository } from './users.repository'
import { cleanEmail, cleanFullName, emailKey } from './utils/user.util'

export type UserListResult = { users: UserResponseDto[]; meta: UserListMetaDto }

/** Reasons recorded on sessions this module ends; the person sees them in their sessions list. */
const SESSION_END_REASONS = {
  suspended: 'Account suspended',
  archived: 'Account archived',
  passwordSet: 'Password changed by an administrator',
  revoked: 'Signed out by an administrator',
  twoFactorOff: 'Two-step sign-in switched off by an administrator',
} as const

/**
 * Everything the school's administrators can do to accounts, and the rules that stop the school
 * locking itself out: the last active administrator is never suspended, archived or moved to
 * another role, and nobody can do those things to their own account.
 */
@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly tokensRepository: UserTokensRepository,
    private readonly rolesService: RolesService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.usersRepository.syncIndexes()
      const filled = await this.usersRepository.backfillTwoFactorDefaults()
      if (filled > 0) {
        this.logger.log(`Filled in two-step sign-in defaults on ${filled} account(s) created before that field existed.`)
      }
    } catch (error) {
      // The app still runs: a missing index costs speed, not correctness, and is worth reporting.
      this.logger.error(`Could not sync user indexes: ${error instanceof Error ? error.message : 'unknown error'}`)
    }
  }

  async list(query: ListUsersQueryDto): Promise<UserListResult> {
    const skip = (query.page - 1) * query.limit
    const [page, counts, roles] = await Promise.all([
      this.usersRepository.findPage(
        { search: query.search || undefined, status: query.status, roleId: query.roleId },
        { sortBy: query.sortBy, sortOrder: query.sortOrder, skip, limit: query.limit },
      ),
      this.usersRepository.countByStatus(),
      this.rolesService.listAll(),
    ])
    const rolesById = new Map(roles.map((role) => [role.id, role]))
    const fullAccessRoleIds = roles.filter((role) => role.fullAccess).map((role) => role.id)
    const administrators = await this.usersRepository.countActiveWithRoles(fullAccessRoleIds)
    const now = new Date()

    return {
      users: page.users.map((user) => toUserResponse(user, this.summarize(rolesById.get(user.roleId)), now)),
      meta: toUserListMeta(counts, administrators, { total: page.total, page: query.page, limit: query.limit }),
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    return this.present(await this.getUserOrThrow(id))
  }

  async create(dto: CreateUserDto, actor?: AuthenticatedUserContext): Promise<CreatedUserResponseDto> {
    const email = cleanEmail(dto.email)
    const key = emailKey(email)
    await this.ensureEmailIsFree(key)

    const role = await this.rolesService.findByIdOrNull(dto.roleId)
    if (!role) throw roleNotFound(dto.roleId)
    this.ensureCanAssign(role, actor)

    const fullName = cleanFullName(dto.fullName)
    const temporaryPassword = dto.temporaryPassword?.length ? dto.temporaryPassword : null
    if (temporaryPassword) {
      const reason = findWeakPasswordReason(temporaryPassword, { email, fullName })
      if (reason) throw weakPassword(reason, 'temporaryPassword')
    }

    const now = new Date()
    let created: UserRecord
    try {
      created = await this.usersRepository.create({
        fullName,
        email,
        emailKey: key,
        phone: dto.phone ?? '',
        designation: dto.designation ?? '',
        roleId: role.id,
        status: temporaryPassword ? 'active' : 'invited',
        createdBy: actor?.id ?? null,
        passwordHash: temporaryPassword ? await hashPassword(temporaryPassword) : '',
        passwordUpdatedAt: temporaryPassword ? now : null,
        mustChangePassword: temporaryPassword !== null,
        activatedAt: temporaryPassword ? now : null,
      })
    } catch (error) {
      // Two requests can pass the check above at the same moment; the unique index decides.
      if (isDuplicateKeyError(error)) throw emailTaken(email)
      throw error
    }

    await this.auditService.record('user.created', {
      actor,
      targetUserId: created._id,
      targetName: created.fullName,
      summary: `${role.name}, ${temporaryPassword ? 'given a temporary password' : 'invited by email'}`,
    })

    if (temporaryPassword) {
      return { user: this.presentWith(created, role), invitationEmailSent: false }
    }

    const invitation = await this.issueInvitation(created, role, actor)
    return {
      user: this.presentWith(invitation.user, role),
      invitationEmailSent: invitation.emailSent,
      // Only when the email did not go out, so the administrator can pass the link on another way.
      ...(invitation.emailSent ? {} : { invitationLink: invitation.link }),
    }
  }

  async update(id: string, dto: UpdateUserDto, actor?: AuthenticatedUserContext): Promise<UserResponseDto> {
    const user = await this.getUserOrThrow(id)
    const changes: UserChanges = {}

    if (dto.fullName !== undefined && dto.fullName !== user.fullName) changes.fullName = dto.fullName
    if (dto.phone !== undefined && dto.phone !== user.phone) changes.phone = dto.phone
    if (dto.designation !== undefined && dto.designation !== user.designation) changes.designation = dto.designation
    if (dto.email !== undefined) {
      const email = cleanEmail(dto.email)
      const key = emailKey(email)
      if (key !== user.emailKey) {
        await this.ensureEmailIsFree(key, user._id)
        changes.email = email
        changes.emailKey = key
      } else if (email !== user.email) {
        // Same address, different capitals: keep it the way the person writes it.
        changes.email = email
      }
    }
    if (Object.keys(changes).length === 0) throw noUserChanges()
    changes.updatedBy = actor?.id ?? null

    try {
      const updated = await this.usersRepository.updateById(id, changes)
      if (!updated) throw userNotFound(id)
      await this.auditService.record('user.updated', {
        actor,
        targetUserId: updated._id,
        targetName: updated.fullName,
        summary: Object.keys(changes)
          .filter((field) => field !== 'updatedBy' && field !== 'emailKey')
          .join(', '),
      })
      return this.present(updated)
    } catch (error) {
      if (isDuplicateKeyError(error)) throw emailTaken(changes.email ?? user.email)
      throw error
    }
  }

  async changeRole(id: string, dto: ChangeUserRoleDto, actor?: AuthenticatedUserContext): Promise<UserResponseDto> {
    const user = await this.getUserOrThrow(id)
    this.ensureNotSelf(user, actor, 'change the role on')

    const role = await this.rolesService.findByIdOrNull(dto.roleId)
    if (!role) throw roleNotFound(dto.roleId)
    if (role.id === user.roleId) throw roleUnchanged(role.name)
    this.ensureCanAssign(role, actor)

    // Moving off a full-access role can leave the school with nobody able to manage it.
    if (!role.fullAccess) await this.ensureNotLastAdministrator(user, 'moved to another role')

    const previousRole = await this.rolesService.findByIdOrNull(user.roleId)
    const updated = await this.usersRepository.updateById(id, { roleId: role.id, updatedBy: actor?.id ?? null })
    if (!updated) throw userNotFound(id)
    await this.auditService.record('user.role_changed', {
      actor,
      targetUserId: updated._id,
      targetName: updated.fullName,
      summary: `${previousRole?.name ?? 'No role'} to ${role.name}`,
    })
    return this.presentWith(updated, role)
  }

  async changeStatus(id: string, dto: ChangeUserStatusDto, actor?: AuthenticatedUserContext): Promise<UserResponseDto> {
    const user = await this.getUserOrThrow(id)
    if (user.status === dto.status) throw statusUnchanged(dto.status)
    this.ensureNotSelf(user, actor, dto.status === 'suspended' ? 'suspend' : 'change the status of')

    if (dto.status === 'suspended') await this.ensureNotLastAdministrator(user, 'suspended')

    // Switching on an account that never set a password would leave an account nobody can use, so
    // it goes back to invited and a fresh invitation goes out.
    if (dto.status === 'active' && user.passwordHash === '') {
      const role = await this.rolesService.findByIdOrNull(user.roleId)
      const restored = (await this.usersRepository.updateById(id, { status: 'invited', updatedBy: actor?.id ?? null })) ?? user
      const invitation = await this.issueInvitation(restored, role, actor)
      return this.presentWith(invitation.user, role)
    }

    const updated = await this.usersRepository.updateById(id, { status: dto.status, updatedBy: actor?.id ?? null })
    if (!updated) throw userNotFound(id)

    if (dto.status === 'suspended') {
      // Access has to stop now, not the next time the person signs in.
      await this.sessionsRepository.revokeAllForUser(id, SESSION_END_REASONS.suspended)
    }
    await this.auditService.record(dto.status === 'suspended' ? 'user.suspended' : 'user.reactivated', {
      actor,
      targetUserId: updated._id,
      targetName: updated.fullName,
      summary: dto.reason ?? '',
    })
    return this.present(updated)
  }

  /**
   * Archives an account: it keeps every record it created, stops signing in, and its email address
   * stays taken. Switching it back on is a status change, so nothing is lost.
   */
  async archive(id: string, actor?: AuthenticatedUserContext): Promise<UserResponseDto> {
    const user = await this.getUserOrThrow(id)
    if (user.status === 'archived') throw statusUnchanged('archived')
    this.ensureNotSelf(user, actor, 'archive')
    await this.ensureNotLastAdministrator(user, 'archived')

    const updated = await this.usersRepository.updateById(id, { status: 'archived', updatedBy: actor?.id ?? null })
    if (!updated) throw userNotFound(id)
    await this.sessionsRepository.revokeAllForUser(id, SESSION_END_REASONS.archived)
    await this.tokensRepository.invalidateOpenTokens(id, 'invitation')
    await this.tokensRepository.invalidateOpenTokens(id, 'password_reset')
    await this.auditService.record('user.archived', {
      actor,
      targetUserId: updated._id,
      targetName: updated.fullName,
    })
    return this.present(updated)
  }

  /** Sends the invitation again and cancels the earlier link, for an account with no password yet. */
  async resendInvitation(id: string, actor?: AuthenticatedUserContext): Promise<InvitationSentResponseDto> {
    const user = await this.getUserOrThrow(id)
    if (user.status === 'archived') throw archivedAccount('be invited')
    if (user.passwordHash !== '') throw alreadyActivated(user.fullName)

    const role = await this.rolesService.findByIdOrNull(user.roleId)
    const invitation = await this.issueInvitation(user, role, actor)
    await this.auditService.record('user.invitation_sent', {
      actor,
      targetUserId: user._id,
      targetName: user.fullName,
      summary: invitation.emailSent ? 'Emailed' : 'Email failed; link shared by hand',
    })
    return {
      user: this.presentWith(invitation.user, role),
      emailSent: invitation.emailSent,
      ...(invitation.emailSent ? {} : { link: invitation.link }),
      expiresAt: invitation.expiresAt.toISOString(),
    }
  }

  /** Emails a password reset link, for someone who can no longer sign in. */
  async sendPasswordReset(id: string, actor?: AuthenticatedUserContext): Promise<InvitationSentResponseDto> {
    const user = await this.getUserOrThrow(id)
    if (user.status === 'archived') throw archivedAccount('be sent a reset link')

    const { token, tokenHash } = generateSecretToken()
    const expiresInMinutes = this.authConfig.resetExpiryMinutes
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60_000)
    await this.tokensRepository.invalidateOpenTokens(user._id, 'password_reset')
    await this.tokensRepository.create({
      userId: user._id,
      purpose: 'password_reset',
      tokenHash,
      expiresAt,
      createdBy: actor?.id ?? null,
    })

    const link = this.buildLink('password_reset', token)
    const emailSent = await this.mailService.sendPasswordReset({
      to: user.email,
      fullName: user.fullName,
      actionUrl: link,
      expiresInMinutes,
      startedByAdministrator: true,
    })
    await this.auditService.record('user.password_reset_sent', {
      actor,
      targetUserId: user._id,
      targetName: user.fullName,
      summary: emailSent ? 'Emailed' : 'Email failed; link shared by hand',
    })
    return {
      user: await this.present(user),
      emailSent,
      ...(emailSent ? {} : { link }),
      expiresAt: expiresAt.toISOString(),
    }
  }

  /**
   * Sets a password an administrator can read out, for a colleague at the desk or when email is
   * down. Every session of that account ends and the person chooses their own at the next sign-in.
   */
  async setTemporaryPassword(
    id: string,
    dto: SetTemporaryPasswordDto,
    actor?: AuthenticatedUserContext,
  ): Promise<TemporaryPasswordResponseDto> {
    const user = await this.getUserOrThrow(id)
    if (user.status === 'archived') throw archivedAccount('have its password changed')

    const password = dto.password ?? generateTemporaryPassword()
    const reason = findWeakPasswordReason(password, { email: user.email, fullName: user.fullName })
    if (reason) throw weakPassword(reason)

    const now = new Date()
    const updated = await this.usersRepository.updateById(id, {
      passwordHash: await hashPassword(password),
      passwordUpdatedAt: now,
      mustChangePassword: true,
      failedLoginCount: 0,
      lockedUntil: null,
      status: user.status === 'invited' ? 'active' : user.status,
      activatedAt: user.activatedAt ?? now,
      updatedBy: actor?.id ?? null,
    })
    if (!updated) throw userNotFound(id)

    const sessionsEnded = await this.sessionsRepository.revokeAllForUser(id, SESSION_END_REASONS.passwordSet)
    await this.tokensRepository.invalidateOpenTokens(id, 'invitation')
    await this.tokensRepository.invalidateOpenTokens(id, 'password_reset')

    await this.auditService.record('user.temporary_password_set', {
      actor,
      targetUserId: updated._id,
      targetName: updated.fullName,
      summary: sessionsEnded > 0 ? `${sessionsEnded} session${sessionsEnded === 1 ? '' : 's'} ended` : '',
    })
    return { user: await this.present(updated), temporaryPassword: password, sessionsEnded }
  }

  /** What has happened to this account: who changed it, and when. */
  async listAuditEvents(id: string): Promise<AuditEventResponseDto[]> {
    await this.getUserOrThrow(id)
    return this.auditService.listForUser(id)
  }

  /**
   * Switches off two-step sign-in for someone who has lost their phone and their recovery codes.
   * It can't be switched on for another person: only whoever holds the app can do that.
   */
  async disableTwoFactor(id: string, actor?: AuthenticatedUserContext): Promise<UserResponseDto> {
    const user = await this.getUserOrThrow(id)
    if (!user.twoFactorEnabled) throw twoFactorNotOn(user.fullName)

    const updated = await this.usersRepository.updateById(id, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorConfirmedAt: null,
      twoFactorRecoveryHashes: [],
      updatedBy: actor?.id ?? null,
    })
    if (!updated) throw userNotFound(id)

    // Anyone signed in as them keeps only a password between themselves and the account, so those
    // sessions end and the person sets it up again.
    await this.sessionsRepository.revokeAllForUser(id, SESSION_END_REASONS.twoFactorOff)
    await this.auditService.record('user.two_factor_disabled', {
      actor,
      targetUserId: updated._id,
      targetName: updated.fullName,
      summary: 'Switched off by an administrator',
    })
    return this.present(updated)
  }

  async listSessions(id: string): Promise<UserSessionResponseDto[]> {
    await this.getUserOrThrow(id)
    const sessions = await this.sessionsRepository.findLiveByUser(id, new Date())
    return sessions.map((session) => toSessionResponse(session))
  }

  async revokeSessions(id: string, actor?: AuthenticatedUserContext): Promise<SessionsEndedResponseDto> {
    await this.getUserOrThrow(id)
    const sessionsEnded = await this.sessionsRepository.revokeAllForUser(
      id,
      SESSION_END_REASONS.revoked,
      // An administrator signing out their own other devices keeps the one they are using.
      actor?.id === id ? actor.sessionId : undefined,
    )
    const target = await this.usersRepository.findById(id)
    await this.auditService.record('user.sessions_revoked', {
      actor,
      targetUserId: id,
      targetName: target?.fullName ?? '',
      summary: `${sessionsEnded} session${sessionsEnded === 1 ? '' : 's'} ended`,
    })
    return { sessionsEnded }
  }

  private get authConfig(): AuthEnvConfig {
    return this.configService.getOrThrow<AuthEnvConfig>('auth')
  }

  /** The page in the web app that an emailed link opens. */
  private buildLink(purpose: TokenPurpose, token: string): string {
    const appUrl = this.configService.get<AppEnvConfig>('app')?.appUrl ?? 'http://localhost:5173'
    const path = purpose === 'invitation' ? '/set-password' : '/reset-password'
    return `${appUrl}${path}?token=${encodeURIComponent(token)}`
  }

  private async issueInvitation(
    user: UserRecord,
    role: RoleResponseDto | null,
    actor?: AuthenticatedUserContext,
  ): Promise<{ user: UserRecord; emailSent: boolean; link: string; expiresAt: Date }> {
    const { token, tokenHash } = generateSecretToken()
    const expiresInHours = this.authConfig.invitationExpiryHours
    const expiresAt = new Date(Date.now() + expiresInHours * 3_600_000)
    // An older invitation must stop working the moment a new one is sent.
    await this.tokensRepository.invalidateOpenTokens(user._id, 'invitation')
    await this.tokensRepository.create({
      userId: user._id,
      purpose: 'invitation',
      tokenHash,
      expiresAt,
      createdBy: actor?.id ?? null,
    })

    const link = this.buildLink('invitation', token)
    const emailSent = await this.mailService.sendInvitation({
      to: user.email,
      fullName: user.fullName,
      roleName: role?.name ?? 'staff',
      actionUrl: link,
      expiresInHours,
    })
    const updated = await this.usersRepository.updateById(user._id, { invitedAt: new Date() })
    return { user: updated ?? user, emailSent, link, expiresAt }
  }

  private async ensureEmailIsFree(key: string, exceptId?: string): Promise<void> {
    const existing = await this.usersRepository.findByEmailKey(key)
    if (!existing || existing._id === exceptId) return
    throw existing.status === 'archived' ? emailBelongsToArchivedAccount(existing.email) : emailTaken(existing.email)
  }

  private ensureNotSelf(user: UserRecord, actor: AuthenticatedUserContext | undefined, action: string): void {
    if (actor && actor.id === user._id) throw cannotModifySelf(action)
  }

  /**
   * Handing out full access is how someone could promote themselves past their own permissions, so
   * only an account that already has it may do that.
   */
  private ensureCanAssign(role: RoleResponseDto, actor?: AuthenticatedUserContext): void {
    if (!role.fullAccess) return
    // No actor means AUTH_ENABLED is off (development); the guard has already warned about that.
    if (actor && !actor.isAdministrator) throw cannotGrantFullAccess(role.name)
  }

  private async ensureNotLastAdministrator(user: UserRecord, action: string): Promise<void> {
    const fullAccessRoleIds = await this.rolesService.getFullAccessRoleIds()
    if (!fullAccessRoleIds.includes(user.roleId) || user.status !== 'active') return
    const othersLeft = await this.usersRepository.countActiveWithRoles(fullAccessRoleIds, user._id)
    if (othersLeft === 0) throw lastAdministrator(action)
  }

  private async getUserOrThrow(id: string): Promise<UserRecord> {
    const user = await this.usersRepository.findById(id)
    if (!user) throw userNotFound(id)
    return user
  }

  private summarize(role: RoleResponseDto | null | undefined): UserRoleSummaryDto | null {
    return role ? { id: role.id, name: role.name, fullAccess: role.fullAccess } : null
  }

  private async present(user: UserRecord): Promise<UserResponseDto> {
    return this.presentWith(user, await this.rolesService.findByIdOrNull(user.roleId))
  }

  private presentWith(user: UserRecord, role: RoleResponseDto | null): UserResponseDto {
    return toUserResponse(user, this.summarize(role))
  }
}
