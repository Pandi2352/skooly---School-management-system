import { ZodError } from 'zod'
import { ApiError } from './ApiError'

/** A plain-language message that is safe to show users: never raw server errors or stack traces. */
export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status >= 500) return 'The server had a problem. Try again in a moment.'
    return error.message
  }
  // The response didn't match the schema: the API contract changed or the data is broken.
  if (error instanceof ZodError) {
    return 'The server sent data this page can’t read. Try again, or tell your administrator.'
  }
  // fetch rejects with a TypeError when the network or CORS fails.
  if (error instanceof TypeError)
    return 'Can’t reach the server. Check your connection and try again.'
  return 'Something went wrong. Try again.'
}
