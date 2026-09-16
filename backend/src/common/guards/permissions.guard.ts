import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

export interface AuthenticatedUserContext {
  id: string
  roleId: string
  isAdministrator?: boolean
  permissions: string[]
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )

    // If no granular permissions were specified, access is allowed by default (authenticated user)
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUserContext }>()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('Access denied: unauthenticated principal.')
    }

    // Administrators bypass granular permission checks
    if (user.isAdministrator) {
      return true
    }

    const userPermissions = new Set(user.permissions || [])
    const hasAll = requiredPermissions.every((perm) => userPermissions.has(perm))

    if (!hasAll) {
      throw new ForbiddenException(
        `Access denied: missing required permissions (${requiredPermissions.join(', ')}).`,
      )
    }

    return true
  }
}
