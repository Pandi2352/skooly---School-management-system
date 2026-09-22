import type { StaffFilters, LeaveFilters } from '../types/staff.types'

// Invalidate broadly (staffKeys.lists()), read narrowly (staffKeys.list(filters)).
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: StaffFilters) => [...staffKeys.lists(), filters] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  stats: () => [...staffKeys.all, 'stats'] as const,
  leaves: () => [...staffKeys.all, 'leaves'] as const,
  leaveList: (filters: LeaveFilters) => [...staffKeys.leaves(), filters] as const,
  evaluations: () => [...staffKeys.all, 'evaluations'] as const,
  evaluationList: (staffId?: string) => [...staffKeys.evaluations(), staffId] as const,
  jobs: () => [...staffKeys.all, 'jobs'] as const,
  applicants: (jobId: string) => [...staffKeys.jobs(), jobId, 'applicants'] as const,
}
