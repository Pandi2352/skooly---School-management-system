/**
 * The two response shapes every endpoint returns. `success` tells them apart; `statusCode` always
 * matches the HTTP status.
 */

export interface ApiFieldError {
  /** Dotted path to the input that failed, e.g. "name" or "permissions.3". Empty for request-wide problems. */
  field: string
  message: string
}

export interface ApiSuccessResponse<T> {
  success: true
  statusCode: number
  message: string
  data: T
  /** Extra information about `data`, such as counts or pagination. */
  meta?: Record<string, unknown>
  path: string
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  statusCode: number
  message: string
  errorCode: string
  errors: ApiFieldError[]
  data: null
  path: string
  method: string
  timestamp: string
}
