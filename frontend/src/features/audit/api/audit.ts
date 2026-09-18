import { api } from '@/lib/api/client'
import type { AuditAction, AuditPeriod } from '../constants'
import { auditEventListSchema, auditListMetaSchema } from '../schemas/audit.schema'
import type { AuditListResult } from '../types/audit.types'
import { readSampleAuditEvents } from './sample/sampleAuditEvents'

export type AuditListQuery = {
  search: string
  action: AuditAction | 'all'
  period: AuditPeriod
  page: number
  limit: number
}

function toSearchParams(query: AuditListQuery): string {
  const params = new URLSearchParams({
    period: query.period,
    page: String(query.page),
    limit: String(query.limit),
  })
  if (query.search) params.set('search', query.search)
  if (query.action !== 'all') params.set('action', query.action)
  return params.toString()
}

/** Reads the trail from the backend; unit tests run against labelled sample events instead. */
export async function getAuditEvents(query: AuditListQuery): Promise<AuditListResult> {
  if (import.meta.env.MODE === 'test') return readSampleAuditEvents(query)
  const { data, meta } = await api.getWithMeta(
    `/audit?${toSearchParams(query)}`,
    auditEventListSchema,
    auditListMetaSchema,
  )
  return { events: data, meta }
}
