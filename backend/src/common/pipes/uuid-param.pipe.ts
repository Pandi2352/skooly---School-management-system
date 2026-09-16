import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { ErrorCode } from '../constants/error-codes.constant'
import { AppException } from '../exceptions/app.exception'
import { isValidUuid } from '../utils/uuid.util'

/**
 * Validates a route parameter as a UUID v4 (the id format of every record) before it reaches the
 * database, and lower-cases it. Usage: `@Param('id', UuidParamPipe) id: string`.
 */
@Injectable()
export class UuidParamPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const field = metadata.data ?? 'id'
    if (!isValidUuid(value)) {
      throw new AppException(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_ID, `"${field}" must be a valid UUID.`, [
        { field, message: 'Use a UUID v4, like 3f2b8c1e-9a4d-4c7e-8b21-5d6f0a9e1c34.' },
      ])
    }
    return value.toLowerCase()
  }
}
