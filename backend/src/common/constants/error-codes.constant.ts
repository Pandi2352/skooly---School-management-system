/**
 * Machine-readable error codes shared by every module. Clients branch on `errorCode`, never on the
 * human `message`, so messages can be reworded without breaking anyone.
 * Modules add their own codes (e.g. ROLE_NAME_TAKEN) next to their code.
 */
export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_ID = 'INVALID_ID',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  CONFLICT = 'CONFLICT',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
  UNPROCESSABLE = 'UNPROCESSABLE',
  /** A chosen password is too short or too easy to guess (used by both auth and users). */
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

/** Fallback code for plain HttpExceptions thrown without one. */
export function errorCodeForStatus(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return ErrorCode.BAD_REQUEST
    case 401:
      return ErrorCode.UNAUTHORIZED
    case 403:
      return ErrorCode.FORBIDDEN
    case 404:
      return ErrorCode.NOT_FOUND
    case 405:
      return ErrorCode.METHOD_NOT_ALLOWED
    case 409:
      return ErrorCode.CONFLICT
    case 413:
      return ErrorCode.PAYLOAD_TOO_LARGE
    case 422:
      return ErrorCode.UNPROCESSABLE
    case 429:
      return ErrorCode.TOO_MANY_REQUESTS
    case 503:
      return ErrorCode.SERVICE_UNAVAILABLE
    default:
      return statusCode >= 500 ? ErrorCode.INTERNAL_ERROR : ErrorCode.BAD_REQUEST
  }
}
