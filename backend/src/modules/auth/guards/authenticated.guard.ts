import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import type { AuthenticatedUserContext } from '../../../common/guards/permissions.guard'
import { notSignedIn } from '../auth.errors'

/**
 * For routes that are about the signed-in person themselves (their profile, password, sessions).
 * Unlike PermissionsGuard this applies whatever AUTH_ENABLED says, because without a session there
 * is genuinely nobody to answer for.
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUserContext }>()
    if (!request.user) throw notSignedIn()
    return true
  }
}
