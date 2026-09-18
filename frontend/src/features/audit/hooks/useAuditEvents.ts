import { useQuery } from '@tanstack/react-query'
import { auditKeys } from '../api/auditKeys'
import { getAuditEvents, type AuditListQuery } from '../api/audit'

export function useAuditEvents(query: AuditListQuery) {
  return useQuery({
    queryKey: auditKeys.list(query),
    queryFn: () => getAuditEvents(query),
    // Keeps the table on screen while a new page or filter loads, instead of flashing empty.
    placeholderData: (previous) => previous,
  })
}
