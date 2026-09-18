import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { AuthenticatedUserContext } from '../guards/permissions.guard'

/**
 * The signed-in user, put on the request by SessionGuard.
 * Undefined only on @Public() routes and while AUTH_ENABLED is false.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUserContext | undefined =>
    context.switchToHttp().getRequest<{ user?: AuthenticatedUserContext }>().user,
)
