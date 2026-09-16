/** Thrown for any non-2xx response from the NestJS API. */
export class ApiError extends Error {
  readonly status: number
  readonly messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.messages = messages
  }

  static async fromResponse(response: Response) {
    let messages: string[] = []
    try {
      const body: unknown = await response.json()
      // NestJS sends `message` as a string, or as an array of validation messages.
      if (typeof body === 'object' && body !== null && 'message' in body) {
        const { message } = body
        if (typeof message === 'string') messages = [message]
        else if (Array.isArray(message))
          messages = message.filter((item: unknown): item is string => typeof item === 'string')
      }
    } catch {
      // Body wasn't JSON; fall back to the status text below.
    }
    if (messages.length === 0 && response.statusText) messages = [response.statusText]
    return new ApiError(response.status, messages)
  }
}
