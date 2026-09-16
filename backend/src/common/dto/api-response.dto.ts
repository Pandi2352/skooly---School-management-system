import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// Swagger models for the standard envelopes (see common/interfaces/api-response.interface.ts).

export class ApiSuccessEnvelopeDto {
  @ApiProperty({ example: true })
  success: boolean

  @ApiProperty({ example: 200 })
  statusCode: number

  @ApiProperty({ example: 'Request completed successfully.' })
  message: string

  @ApiPropertyOptional({ description: 'Extra information about data, such as counts or pagination' })
  meta?: Record<string, unknown>

  @ApiProperty({ example: '/api/roles' })
  path: string

  @ApiProperty({ example: '2026-09-16T12:00:00.000Z' })
  timestamp: string
}

export class ApiFieldErrorDto {
  @ApiProperty({ example: 'name', description: 'Dotted path to the failing input; empty for request-wide errors' })
  field: string

  @ApiProperty({ example: 'Role name must be between 2 and 40 characters.' })
  message: string
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean

  @ApiProperty({ example: 400 })
  statusCode: number

  @ApiProperty({ example: 'Some fields are invalid. Check the errors and try again.' })
  message: string

  @ApiProperty({ example: 'VALIDATION_FAILED', description: 'Stable code for clients to branch on' })
  errorCode: string

  @ApiProperty({ type: [ApiFieldErrorDto] })
  errors: ApiFieldErrorDto[]

  @ApiProperty({ example: null, nullable: true, type: 'null' })
  data: null

  @ApiProperty({ example: '/api/roles' })
  path: string

  @ApiProperty({ example: 'POST' })
  method: string

  @ApiProperty({ example: '2026-09-16T12:00:00.000Z' })
  timestamp: string
}
