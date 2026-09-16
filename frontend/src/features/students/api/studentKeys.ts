import type { StudentFilters } from '../types/student.types'

// Invalidate broadly (studentKeys.lists()), read narrowly (studentKeys.list(filters)).
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters: StudentFilters) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (studentId: string) => [...studentKeys.details(), studentId] as const,
  classOptions: () => [...studentKeys.all, 'class-options'] as const,
  summary: () => [...studentKeys.all, 'summary'] as const,
}
