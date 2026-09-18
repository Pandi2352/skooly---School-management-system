import type { AuditListQuery } from './audit'

export const auditKeys = {
  all: ['audit'] as const,
  lists: () => [...auditKeys.all, 'list'] as const,
  list: (query: AuditListQuery) => [...auditKeys.lists(), query] as const,
}
