import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'
import type { AppEnvConfig } from '../../config/env.config'
import { ErrorCode } from '../constants/error-codes.constant'
import { AppException } from '../exceptions/app.exception'

/** Methods that change something. GET and HEAD are left alone. */
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * The header the web app sends on every request. A browser will not attach a custom header to a
 * cross-site request without asking permission first (a CORS preflight), and this API only grants
 * that to its own origins — so a form or script on another site can't act as a signed-in person,
 * even though the browser would happily attach the session cookie.
 */
export const REQUESTED_WITH_HEADER = 'x-requested-with'
export const REQUESTED_WITH_VALUE = 'XMLHttpRequest'

/**
 * Cross-site request forgery: the session lives in a cookie, and browsers send cookies with
 * requests started by any site. Two checks close that off, and either one alone would do:
 *
 * 1. Where the request says it came from (Origin, or Referer as a fallback) must be an origin this
 *    API serves.
 * 2. It must carry the custom header above.
 *
 * SameSite=Lax on the cookie is a third layer, applied where the cookie is set.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  private readonly logger = new Logger(CsrfGuard.name)

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') return true
    const request = context.switchToHttp().getRequest<Request>()
    if (!UNSAFE_METHODS.has(request.method)) return true

    const app = this.configService.getOrThrow<AppEnvConfig>('app')
    const source = this.readSource(request)
    if (source && !this.isAllowedOrigin(source, app)) {
      this.logger.warn(`Blocked a ${request.method} to ${request.url} sent from ${source}`)
      throw this.refuse('This request came from somewhere this school’s system doesn’t serve.')
    }

    const requestedWith = request.get(REQUESTED_WITH_HEADER)
    if (requestedWith !== REQUESTED_WITH_VALUE) {
      throw this.refuse(
        `This request is missing the ${REQUESTED_WITH_HEADER} header. Send it from the school’s web app, or set the header on your own client.`,
      )
    }
    return true
  }

  /** Where the browser says the request started. Referer is only a fallback: some clients trim it. */
  private readSource(request: Request): string | null {
    const origin = request.get('origin')
    if (origin && origin !== 'null') return origin
    const referer = request.get('referer')
    if (!referer) return null
    try {
      return new URL(referer).origin
    } catch {
      return null
    }
  }

  private isAllowedOrigin(origin: string, app: AppEnvConfig): boolean {
    // Swagger and any other page served by this API itself.
    if (origin === app.publicBaseUrl) return true
    if (app.corsOrigins.includes(origin)) return true
    // A development machine runs the web app on whatever port Vite picked.
    if (app.nodeEnv !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return true
    }
    return false
  }

  private refuse(message: string): AppException {
    return new AppException(HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN, message)
  }
}
