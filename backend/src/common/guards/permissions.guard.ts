import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { ErrorCode } from '../constants/error-codes.constant'
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { AppException } from '../exceptions/app.exception'

export interface AuthenticatedUserContext {
  id: string
  roleId: string
  isAdministrator?: boolean
  permissions: string[]
  /** The session this request came from, so "sign out my other devices" can keep this one. */
  sessionId?: string
  email?: string
  fullName?: string
  /** True until the person replaces a temporary password; the app then only lets them do that. */
  mustChangePassword?: boolean
}

/**
 * Checks @RequirePermissions keys against request.user, which SessionGuard puts there.
 * Checks are skipped while AUTH_ENABLED is false (with a one-time warning) so a development machine
 * can work without signing in; that switch must be true in production.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name)
  private warnedAuthDisabled = false

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()]
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets)) return true

    const requiredPermissions = this.reflector.getAllAndOverride<string[] | undefined>(PERMISSIONS_KEY, targets) ?? []
    if (requiredPermissions.length === 0) return true

    if (!this.configService.get<boolean>('app.authEnabled')) {
      if (!this.warnedAuthDisabled) {
        this.logger.warn('AUTH_ENABLED is false: permission checks are skipped. Enable it once login is built.')
        this.warnedAuthDisabled = true
      }
      return true
    }

    const user = context.switchToHttp().getRequest<{ user?: AuthenticatedUserContext }>().user
    if (!user) {
      throw new AppException(HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, 'Sign in to continue.')
    }
    if (user.isAdministrator) return true

    const granted = new Set(user.permissions)
    const missing = requiredPermissions.filter((permission) => !granted.has(permission))
    if (missing.length > 0) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        ErrorCode.FORBIDDEN,
        'Your role doesn’t allow this action. Ask an administrator for access.',
        missing.map((permission) => ({ field: '', message: `Missing permission: ${permission}` })),
      )
    }
    return true
  }
}
