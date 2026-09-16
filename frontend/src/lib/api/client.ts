import type { z } from 'zod'
import { env } from '@/config/env'
import { invariant } from '@/lib/assert'
import { ApiError } from './ApiError'

type RequestOptions = Omit<RequestInit, 'method' | 'body' | 'headers'> & {
  headers?: Record<string, string>
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 15_000

/**
 * Every response is parsed with the caller's Zod schema: the API sits outside this app's type
 * system, so its data is checked here instead of trusted with `as`.
 */
async function request<S extends z.ZodType>(
  method: string,
  path: string,
  schema: S,
  body: unknown,
  { headers, timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...init }: RequestOptions = {},
): Promise<z.output<S>> {
  invariant(
    env.apiUrl,
    'VITE_API_URL is not set. Copy .env.example to .env and set the API address.',
  )

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    method,
    // Login uses an httpOnly session cookie (FRONTEND.md D2), so cookies must be sent.
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: signal ?? AbortSignal.timeout(timeoutMs),
  })

  if (!response.ok) throw await ApiError.fromResponse(response)
  const raw: unknown = response.status === 204 ? undefined : await response.json()
  const payload =
    raw !== null && typeof raw === 'object' && 'data' in raw && 'success' in raw
      ? (raw as { data: unknown }).data
      : raw
  return schema.parse(payload)
}

// Pass `z.undefined()` as the schema for endpoints that return no body (204).
export const api = {
  get: <S extends z.ZodType>(path: string, schema: S, options?: RequestOptions) =>
    request('GET', path, schema, undefined, options),
  post: <S extends z.ZodType>(path: string, schema: S, body?: unknown, options?: RequestOptions) =>
    request('POST', path, schema, body, options),
  put: <S extends z.ZodType>(path: string, schema: S, body?: unknown, options?: RequestOptions) =>
    request('PUT', path, schema, body, options),
  patch: <S extends z.ZodType>(path: string, schema: S, body?: unknown, options?: RequestOptions) =>
    request('PATCH', path, schema, body, options),
  delete: <S extends z.ZodType>(path: string, schema: S, options?: RequestOptions) =>
    request('DELETE', path, schema, undefined, options),
}
