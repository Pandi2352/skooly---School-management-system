import type { z } from 'zod'
import type { auditEventSchema, auditListMetaSchema } from '../schemas/audit.schema'

export type AuditEvent = z.infer<typeof auditEventSchema>
export type AuditListMeta = z.infer<typeof auditListMetaSchema>
export type AuditListResult = { events: AuditEvent[]; meta: AuditListMeta }
