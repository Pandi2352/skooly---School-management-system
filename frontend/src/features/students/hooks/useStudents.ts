import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getStudents } from '../api/getStudents'
import { studentKeys } from '../api/studentKeys'
import type { StudentFilters } from '../types/student.types'

export function useStudents(filters: StudentFilters) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => getStudents(filters),
    // The previous page stays on screen while the next one loads.
    placeholderData: keepPreviousData,
  })
}
