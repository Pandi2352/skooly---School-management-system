import { applyDecorators, HttpStatus, Type } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { ApiErrorResponseDto, ApiSuccessEnvelopeDto } from '../dto/api-response.dto'

type ApiSuccessOptions = {
  description: string
  status?: HttpStatus
  isArray?: boolean
  /** Swagger model for `meta`, when the handler returns ResponseWithMeta. */
  meta?: Type<unknown>
}

/** Documents a success response as the standard envelope with `data` typed as `model`. */
export function ApiSuccess(model: Type<unknown>, options: ApiSuccessOptions) {
  const status = options.status ?? HttpStatus.OK
  const dataSchema = options.isArray
    ? { type: 'array', items: { $ref: getSchemaPath(model) } }
    : { $ref: getSchemaPath(model) }
  const extraModels = [ApiSuccessEnvelopeDto, model, ...(options.meta ? [options.meta] : [])]

  return applyDecorators(
    ApiExtraModels(...extraModels),
    ApiResponse({
      status,
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessEnvelopeDto) },
          {
            properties: {
              statusCode: { type: 'number', example: status },
              data: dataSchema,
              ...(options.meta ? { meta: { $ref: getSchemaPath(options.meta) } } : {}),
            },
          },
        ],
      },
    }),
  )
}

const ERROR_DESCRIPTIONS: Partial<Record<HttpStatus, string>> = {
  [HttpStatus.BAD_REQUEST]: 'Invalid input: see errorCode and errors',
  [HttpStatus.UNAUTHORIZED]: 'Not signed in',
  [HttpStatus.FORBIDDEN]: 'Signed in but not allowed',
  [HttpStatus.NOT_FOUND]: 'The record does not exist',
  [HttpStatus.CONFLICT]: 'Conflicts with existing data, such as a duplicate name',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Valid input, but a business rule does not allow it',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Unexpected server error',
}

/** Documents the standard error envelope for each given status. */
export function ApiErrors(...statuses: HttpStatus[]) {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ...statuses.map((status) =>
      ApiResponse({
        status,
        description: ERROR_DESCRIPTIONS[status] ?? 'Error',
        type: ApiErrorResponseDto,
      }),
    ),
  )
}
