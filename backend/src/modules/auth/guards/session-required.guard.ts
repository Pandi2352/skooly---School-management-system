import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import type { AuthenticatedUserContext } from '../../../common/guards/permissions.guard'
import { notSignedIn } from '../auth.errors'

/**
 * For endpoints about the signed-in person themselves (their account, password and sessions).
 * Unlike the app-wide AuthenticatedGuard this applies whatever AUTH_ENABLED says: without a session
 * there is genuinely nobody whose password could be changed.
 */
@Injectable()
export class SessionRequiredGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUserContext }>()
    if (!request.user) throw notSignedIn()
    return true
  }
}
