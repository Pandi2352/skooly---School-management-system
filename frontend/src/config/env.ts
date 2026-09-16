import { z } from 'zod'

// The only place that reads import.meta.env. Values are validated once, at startup.
const envSchema = z.object({
  // Optional until the first API call; lib/api/client.ts throws a clear error if it's missing.
  VITE_API_URL: z.url().optional(),
})

const parsed = envSchema.safeParse(import.meta.env)
if (!parsed.success) {
  throw new Error(`Invalid environment variables in .env:\n${z.prettifyError(parsed.error)}`)
}

export const env = {
  apiUrl: parsed.data.VITE_API_URL,
  isDev: import.meta.env.DEV,
} as const
