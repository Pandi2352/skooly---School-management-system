/** One invalid input reported by the API, e.g. { field: 'displayName', message: 'Display name must be…' }. */
export type ApiFieldError = { field: string; message: string }

const isFieldError = (item: unknown): item is ApiFieldError =>
  typeof item === 'object' &&
  item !== null &&
  'field' in item &&
  'message' in item &&
  typeof item.field === 'string' &&
  typeof item.message === 'string'

/**
 * Thrown for any non-2xx response from the NestJS API. Reads the standard error envelope
 * (message, errorCode, errors) and older Nest bodies where `message` is a string or a list.
 */
export class ApiError extends Error {
  readonly status: number
  readonly messages: string[]
  /** Stable code to branch on, e.g. "ROLE_NAME_TAKEN"; null when the server didn't send one. */
  readonly errorCode: string | null
  readonly fieldErrors: ApiFieldError[]

  constructor(status: number, messages: string[], errorCode: string | null = null, fieldErrors: ApiFieldError[] = []) {
    super(messages[0] ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.messages = messages
    this.errorCode = errorCode
    this.fieldErrors = fieldErrors
  }

  static async fromResponse(response: Response) {
    let messages: string[] = []
    let errorCode: string | null = null
    let fieldErrors: ApiFieldError[] = []
    try {
      const body: unknown = await response.json()
      if (typeof body === 'object' && body !== null) {
        if ('message' in body) {
          const { message } = body
          if (typeof message === 'string') messages = [message]
          else if (Array.isArray(message))
            messages = message.filter((item: unknown): item is string => typeof item === 'string')
        }
        if ('errorCode' in body && typeof body.errorCode === 'string') errorCode = body.errorCode
        if ('errors' in body && Array.isArray(body.errors)) fieldErrors = body.errors.filter(isFieldError)
      }
    } catch {
      // Body wasn't JSON; fall back to the status text below.
    }
    if (messages.length === 0 && response.statusText) messages = [response.statusText]
    return new ApiError(response.status, messages, errorCode, fieldErrors)
  }
}
