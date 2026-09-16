import { HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common'
import { ErrorCode } from '../constants/error-codes.constant'
import { AppException } from '../exceptions/app.exception'
import type { ApiFieldError } from '../interfaces/api-response.interface'

/** Flattens class-validator's nested errors into one list with dotted field paths. */
export function flattenValidationErrors(errors: ValidationError[], parentPath = ''): ApiFieldError[] {
  return errors.flatMap((error) => {
    const field = parentPath === '' ? error.property : `${parentPath}.${error.property}`
    const own = Object.values(error.constraints ?? {}).map((message) => ({ field, message }))
    return [...own, ...flattenValidationErrors(error.children ?? [], field)]
  })
}

/**
 * The app-wide validation pipe: strips unknown fields and rejects them, converts types, and reports
 * failures as VALIDATION_FAILED with a message per field.
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    stopAtFirstError: false,
    exceptionFactory: (errors) =>
      new AppException(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
        'Some fields are invalid. Check the errors and try again.',
        flattenValidationErrors(errors),
      ),
  })
}
