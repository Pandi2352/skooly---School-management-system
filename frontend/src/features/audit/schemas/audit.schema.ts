import { z } from 'zod'

/** The API sits outside this app's type system, so every response is parsed, never trusted. */
export const auditEventSchema = z.object({
  id: z.string(),
  action: z.string(),
  /** The action in plain words, from the server, so both sides say the same thing. */
  label: z.string(),
  actorName: z.string(),
  targetName: z.string(),
  summary: z.string(),
  ip: z.string(),
  at: z.string(),
})

export const auditEventListSchema = z.array(auditEventSchema)

export const auditListMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  /** How many days of history the school keeps; shown so nobody expects last year's events. */
  retentionDays: z.number(),
})
