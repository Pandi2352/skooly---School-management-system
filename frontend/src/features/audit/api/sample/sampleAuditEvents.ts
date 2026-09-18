import type { AuditListQuery } from '../audit'
import type { AuditEvent, AuditListResult } from '../../types/audit.types'

/**
 * Stand-in events for unit tests only, never shown to a school: the names are labelled as sample
 * data and the app reads the real API in every other mode.
 */
const SAMPLE_EVENTS: AuditEvent[] = [
  {
    id: 'event-1',
    action: 'auth.login',
    label: 'Signed in',
    actorName: 'Sample Administrator',
    targetName: 'Sample Administrator',
    summary: '',
    ip: '203.0.113.7',
    at: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 'event-2',
    action: 'auth.login_failed',
    label: 'Wrong password',
    actorName: '',
    targetName: 'Sample Teacher',
    summary: 'Wrong password (2 in a row)',
    ip: '203.0.113.9',
    at: '2026-09-18T07:40:00.000Z',
  },
  {
    id: 'event-3',
    action: 'user.role_changed',
    label: 'Role changed',
    actorName: 'Sample Administrator',
    targetName: 'Sample Accountant',
    summary: 'Teacher to Accountant',
    ip: '203.0.113.7',
    at: '2026-09-17T11:15:00.000Z',
  },
]

export function readSampleAuditEvents(query: AuditListQuery): AuditListResult {
  const search = query.search.toLowerCase()
  const matches = SAMPLE_EVENTS.filter((event) => {
    const matchesSearch =
      search === '' ||
      event.actorName.toLowerCase().includes(search) ||
      event.targetName.toLowerCase().includes(search) ||
      event.summary.toLowerCase().includes(search)
    const matchesAction = query.action === 'all' || event.action === query.action
    return matchesSearch && matchesAction
  })

  return {
    events: matches,
    meta: {
      total: matches.length,
      page: query.page,
      limit: query.limit,
      totalPages: Math.max(1, Math.ceil(matches.length / query.limit)),
      retentionDays: 400,
    },
  }
}
