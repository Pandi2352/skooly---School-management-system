import { useQuery } from '@tanstack/react-query'
import { getStudentSummary } from '../api/getStudentSummary'
import { studentKeys } from '../api/studentKeys'

export function useStudentSummary() {
  return useQuery({ queryKey: studentKeys.summary(), queryFn: getStudentSummary })
}
