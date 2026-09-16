import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface ResponseFormat<T> {
  success: boolean
  message: string
  data: T
  meta?: unknown
  timestamp: string
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((res) => {
        // If the handler already shaped { data, meta }
        if (res && typeof res === 'object' && 'data' in res && 'meta' in res) {
          return {
            success: true,
            message: 'Request processed successfully',
            data: res.data,
            meta: res.meta,
            timestamp: new Date().toISOString(),
          }
        }

        return {
          success: true,
          message: 'Request processed successfully',
          data: res,
          timestamp: new Date().toISOString(),
        }
      }),
    )
  }
}
