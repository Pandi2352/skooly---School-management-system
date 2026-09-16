import { HttpException, HttpStatus } from '@nestjs/common'
import type { ApiFieldError } from '../interfaces/api-response.interface'

/**
 * The exception every module throws for expected failures. It carries a stable `errorCode` and
 * optional field errors; the global filter turns it into the standard error response.
 */
export class AppException extends HttpException {
  constructor(
    readonly statusCode: HttpStatus,
    readonly errorCode: string,
    message: string,
    readonly errors: ApiFieldError[] = [],
  ) {
    super({ message, errorCode, errors }, statusCode)
  }
}
