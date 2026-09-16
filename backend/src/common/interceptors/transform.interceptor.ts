import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator'
import type { ApiSuccessResponse } from '../interfaces/api-response.interface'
import { ResponseWithMeta } from '../utils/response-with-meta.util'

const DEFAULT_MESSAGES: Record<string, string> = {
  GET: 'Request completed successfully.',
  POST: 'Created successfully.',
  PUT: 'Saved successfully.',
  PATCH: 'Updated successfully.',
  DELETE: 'Deleted successfully.',
}

/**
 * Wraps every successful handler result in the standard success envelope. Handlers return plain
 * data (or ResponseWithMeta); the message comes from @ResponseMessage or a per-method default.
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor<unknown, ApiSuccessResponse<unknown>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<ApiSuccessResponse<unknown>> {
    const http = context.switchToHttp()
    const request = http.getRequest<Request>()
    const response = http.getResponse<Response>()
    const message =
      this.reflector.getAllAndOverride<string | undefined>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ??
      DEFAULT_MESSAGES[request.method] ??
      DEFAULT_MESSAGES.GET

    return next.handle().pipe(
      map((result) => {
        const withMeta = result instanceof ResponseWithMeta
        return {
          success: true as const,
          statusCode: response.statusCode,
          message,
          data: withMeta ? result.data : (result ?? null),
          ...(withMeta ? { meta: result.meta } : {}),
          path: request.originalUrl,
          timestamp: new Date().toISOString(),
        }
      }),
    )
  }
}
