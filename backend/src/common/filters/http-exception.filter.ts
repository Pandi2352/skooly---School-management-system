import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Error as MongooseError } from 'mongoose'
import { ErrorCode, errorCodeForStatus } from '../constants/error-codes.constant'
import { AppException } from '../exceptions/app.exception'
import type { ApiErrorResponse, ApiFieldError } from '../interfaces/api-response.interface'
import { isDuplicateKeyError } from '../utils/mongo-error.util'

type NormalizedError = Pick<ApiErrorResponse, 'statusCode' | 'message' | 'errorCode' | 'errors'>

const INTERNAL_MESSAGE = 'Something went wrong on our side. Please try again.'

/**
 * How Nest reports an address that matches no route: "Cannot POST /api/auth/login". Read quickly it
 * sounds like the endpoint refused the request, which sends people looking in the wrong place.
 */
const UNMATCHED_ROUTE = /^Cannot ([A-Z]+) (\S+)$/

/**
 * Turns every thrown error into the standard error envelope. Expected errors keep their message;
 * unexpected ones are logged with their stack and answered with a generic message, so internals
 * never leak to clients.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp()
    const request = http.getRequest<Request>()
    const response = http.getResponse<Response>()
    const normalized = normalizeException(exception)

    if (normalized.statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.originalUrl} → ${normalized.statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      )
    }

    const body: ApiErrorResponse = {
      success: false,
      ...normalized,
      data: null,
      path: request.originalUrl,
      method: request.method,
      timestamp: new Date().toISOString(),
    }
    response.status(normalized.statusCode).json(body)
  }
}

export function normalizeException(exception: unknown): NormalizedError {
  if (exception instanceof AppException) {
    return {
      statusCode: exception.getStatus(),
      message: exception.message,
      errorCode: exception.errorCode,
      errors: exception.errors,
    }
  }

  if (isDuplicateKeyError(exception)) {
    const fields = Object.keys(exception.keyValue ?? {})
    return {
      statusCode: HttpStatus.CONFLICT,
      message: 'A record with the same value already exists.',
      errorCode: ErrorCode.DUPLICATE_RESOURCE,
      errors: fields.map((field) => ({ field, message: 'This value is already in use.' })),
    }
  }

  if (exception instanceof MongooseError.ValidationError) {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Some fields are invalid. Check the errors and try again.',
      errorCode: ErrorCode.VALIDATION_FAILED,
      errors: Object.values(exception.errors).map((error) => ({ field: error.path, message: error.message })),
    }
  }

  if (exception instanceof MongooseError.CastError) {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: `"${exception.path}" has an invalid value.`,
      errorCode: ErrorCode.INVALID_ID,
      errors: [{ field: exception.path, message: 'Invalid value.' }],
    }
  }

  if (exception instanceof HttpException) {
    const statusCode = exception.getStatus()
    const { message, errors } = readHttpExceptionBody(exception)

    const unmatched = statusCode === HttpStatus.NOT_FOUND ? UNMATCHED_ROUTE.exec(message) : null
    if (unmatched) {
      const [, method, path] = unmatched
      return {
        statusCode,
        message:
          `This server has no ${method} ${path}. Check the address for a typo, and check the server's startup log: ` +
          'if the route is missing from it, the running server is an older build, or the module that provides it failed to load.',
        errorCode: ErrorCode.ENDPOINT_NOT_FOUND,
        errors: [],
      }
    }

    return {
      statusCode,
      // Hide details of 5xx HttpExceptions too; 4xx messages are meant for the client.
      message: statusCode >= 500 ? INTERNAL_MESSAGE : message,
      errorCode: errorCodeForStatus(statusCode),
      errors: statusCode >= 500 ? [] : errors,
    }
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: INTERNAL_MESSAGE,
    errorCode: ErrorCode.INTERNAL_ERROR,
    errors: [],
  }
}

/** Reads Nest's built-in exception bodies: a string, `{ message: string }` or `{ message: string[] }`. */
function readHttpExceptionBody(exception: HttpException): { message: string; errors: ApiFieldError[] } {
  const body = exception.getResponse()
  if (typeof body === 'string') return { message: body, errors: [] }

  const raw: unknown = typeof body === 'object' && body !== null ? Reflect.get(body, 'message') : undefined
  if (Array.isArray(raw)) {
    return {
      message: 'Some fields are invalid. Check the errors and try again.',
      errors: raw.map((item) => ({ field: '', message: String(item) })),
    }
  }
  return { message: typeof raw === 'string' ? raw : exception.message, errors: [] }
}
