import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'
import type { AuthenticatedUserContext } from '../../../common/guards/permissions.guard'
import { hashSecretToken } from '../../../common/utils/token.util'
import type { AppEnvConfig, AuthEnvConfig } from '../../../config/env.config'
import { RolesService } from '../../roles/roles.service'
import { UsersRepository } from '../../users/users.repository'
import { clearSessionCookie, readSessionCookie } from '../auth.cookie'
import { SessionsRepository } from '../sessions/sessions.repository'

/** Below this, moving the idle deadline on every request would write to the database constantly. */
const TOUCH_AFTER_MS = 60_000

/**
 * Turns the session cookie into `request.user` for every request, and nothing more: it never
 * refuses one. AuthenticatedGuard decides which routes need a signed-in person and PermissionsGuard
 * decides what that person may do, so public routes keep working whether or not a cookie is sent.
 *
 * A cookie that no longer matches a live session is cleared, so a stale browser stops sending it.
 */
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp()
    const request = http.getRequest<Request & { user?: AuthenticatedUserContext }>()
    const response = http.getResponse<Response>()
    const auth = this.configService.getOrThrow<AuthEnvConfig>('auth')

    const token = readSessionCookie(request.cookies as Record<string, unknown> | undefined, auth)
    if (!token) return true

    const now = new Date()
    const session = await this.sessionsRepository.findLiveByTokenHash(hashSecretToken(token), now)
    if (!session) {
      this.forget(response, auth)
      return true
    }

    const user = await this.usersRepository.findById(session.userId)
    // Permissions and status are read per request, so suspending someone or changing their role
    // takes effect immediately instead of at their next sign-in.
    if (!user || user.status !== 'active') {
      await this.sessionsRepository.revokeById(session._id, 'Account is no longer active')
      this.forget(response, auth)
      return true
    }

    const role = await this.rolesService.findByIdOrNull(user.roleId)
    request.user = {
      id: user._id,
      roleId: user.roleId,
      isAdministrator: role?.fullAccess ?? false,
      permissions: role?.permissions ?? [],
      sessionId: session._id,
      email: user.email,
      fullName: user.fullName,
      mustChangePassword: user.mustChangePassword,
    }

    if (now.getTime() - new Date(session.lastSeenAt).getTime() > TOUCH_AFTER_MS) {
      const idleMinutes = session.rememberMe ? auth.rememberMeIdleDays * 24 * 60 : auth.sessionIdleMinutes
      const idleExpiresAt = new Date(Math.min(now.getTime() + idleMinutes * 60_000, new Date(session.absoluteExpiresAt).getTime()))
      await this.sessionsRepository.touch(session._id, now, idleExpiresAt)
    }
    return true
  }

  private forget(response: Response, auth: AuthEnvConfig): void {
    clearSessionCookie(response, this.configService.getOrThrow<AppEnvConfig>('app'), auth)
  }
}
