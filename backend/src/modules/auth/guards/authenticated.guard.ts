import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator'
import type { AuthenticatedUserContext } from '../../../common/guards/permissions.guard'
import { notSignedIn } from '../auth.errors'

/**
 * Registered app-wide: every endpoint needs a signed-in person unless it is marked @Public().
 * Being closed by default is the point — a new controller that forgets a decorator is refused, not
 * quietly opened to the internet.
 *
 * While AUTH_ENABLED is false (a development machine with no accounts yet) requests are let
 * through; main.ts refuses to start production in that state.
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticatedGuard.name)
  private warnedAuthDisabled = false

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') return true

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUserContext }>()
    if (request.user) return true

    if (!this.configService.get<boolean>('app.authEnabled')) {
      if (!this.warnedAuthDisabled) {
        this.logger.warn('AUTH_ENABLED is false: endpoints are answering without a sign-in.')
        this.warnedAuthDisabled = true
      }
      return true
    }

    throw notSignedIn()
  }
}
