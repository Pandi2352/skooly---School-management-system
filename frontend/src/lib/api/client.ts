import type { z } from 'zod'
import { env } from '@/config/env'
import { invariant } from '@/lib/assert'
import { ApiError } from './ApiError'

type RequestOptions = Omit<RequestInit, 'method' | 'body' | 'headers'> & {
  headers?: Record<string, string>
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 15_000
const UPLOAD_TIMEOUT_MS = 60_000

/**
 * Every response is parsed with the caller's Zod schema: the API sits outside this app's type
 * system, so its data is checked here instead of trusted with `as`.
 */
async function send(
  method: string,
  path: string,
  body: unknown,
  { headers, timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...init }: RequestOptions = {},
): Promise<unknown> {
  invariant(
    env.apiUrl,
    'VITE_API_URL is not set. Copy .env.example to .env and set the API address.',
  )

  // FormData (file uploads) is sent as-is so the browser sets the multipart boundary itself.
  const isFormData = body instanceof FormData
  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    method,
    // Login uses an httpOnly session cookie (FRONTEND.md D2), so cookies must be sent.
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body === undefined || isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    signal: signal ?? AbortSignal.timeout(timeoutMs),
  })

  if (!response.ok) throw await ApiError.fromResponse(response)
  return response.status === 204 ? undefined : await response.json()
}

/** True for the envelope every endpoint answers with: { success, data, meta? }. */
function isEnvelope(raw: unknown): raw is { data: unknown; meta?: unknown } {
  return raw !== null && typeof raw === 'object' && 'data' in raw && 'success' in raw
}

/**
 * Every response is parsed with the caller's Zod schema: the API sits outside this app's type
 * system, so its data is checked here instead of trusted with `as`.
 */
async function request<S extends z.ZodType>(
  method: string,
  path: string,
  schema: S,
  body: unknown,
  options: RequestOptions = {},
): Promise<z.output<S>> {
  const raw = await send(method, path, body, options)
  return schema.parse(isEnvelope(raw) ? raw.data : raw)
}

/**
 * For list endpoints that send counts or paging beside the rows. A plain get() would drop `meta`,
 * which is what the page needs for "38 active, 2 invited" and for the pager.
 */
async function requestWithMeta<S extends z.ZodType, M extends z.ZodType>(
  method: string,
  path: string,
  schema: S,
  metaSchema: M,
  body: unknown,
  options: RequestOptions = {},
): Promise<{ data: z.output<S>; meta: z.output<M> }> {
  const raw = await send(method, path, body, options)
  if (!isEnvelope(raw)) {
    throw new Error(`${path} answered without the { success, data, meta } envelope.`)
  }
  return { data: schema.parse(raw.data), meta: metaSchema.parse(raw.meta) }
}

// Pass `z.undefined()` as the schema for endpoints that return no body (204).
export const api = {
  get: <S extends z.ZodType>(path: string, schema: S, options?: RequestOptions) =>
    request('GET', path, schema, undefined, options),
  /** Like get, but also returns the envelope's `meta` (list counts, paging). */
  getWithMeta: <S extends z.ZodType, M extends z.ZodType>(
    path: string,
    schema: S,
    metaSchema: M,
    options?: RequestOptions,
  ) => requestWithMeta('GET', path, schema, metaSchema, undefined, options),
  post: <S extends z.ZodType>(path: string, schema: S, body?: unknown, options?: RequestOptions) =>
    request('POST', path, schema, body, options),
  put: <S extends z.ZodType>(path: string, schema: S, body?: unknown, options?: RequestOptions) =>
    request('PUT', path, schema, body, options),
  patch: <S extends z.ZodType>(path: string, schema: S, body?: unknown, options?: RequestOptions) =>
    request('PATCH', path, schema, body, options),
  delete: <S extends z.ZodType>(path: string, schema: S, options?: RequestOptions) =>
    request('DELETE', path, schema, undefined, options),
  /** Sends files as multipart/form-data. Uploads get a longer default timeout than other requests. */
  upload: <S extends z.ZodType>(
    path: string,
    schema: S,
    formData: FormData,
    { method = 'POST', timeoutMs = UPLOAD_TIMEOUT_MS, ...options }: RequestOptions & { method?: 'POST' | 'PUT' } = {},
  ) => request(method, path, schema, formData, { ...options, timeoutMs }),
}
