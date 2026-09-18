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
}

/**
 * Checks @RequirePermissions keys against request.user. Until the login module exists nothing sets
 * request.user, so checks are skipped while AUTH_ENABLED is false (with a one-time warning);
 * otherwise every protected endpoint would reject everyone.
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
