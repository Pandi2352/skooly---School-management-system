import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

export interface ErrorResponsePayload {
  statusCode: number
  timestamp: string
  path: string
  method: string
  message: string | string[]
  error: string
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message: string | string[] = 'Internal server error'
    let error = 'Internal Server Error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()

      if (typeof res === 'string') {
        message = res
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>
        message = (resObj.message as string | string[]) || exception.message
        error = (resObj.error as string) || error
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled error at ${request.method} ${request.url}: ${exception.message}`, exception.stack)
    }

    const payload: ErrorResponsePayload = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    }

    response.status(status).json(payload)
  }
}
