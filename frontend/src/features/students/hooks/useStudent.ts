import { useQuery } from '@tanstack/react-query'
import { getStudent } from '../api/getStudent'
import { studentKeys } from '../api/studentKeys'

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: studentKeys.detail(studentId),
    queryFn: () => getStudent(studentId),
    enabled: studentId.trim().length > 0,
  })
}
