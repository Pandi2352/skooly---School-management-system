import { useQuery } from '@tanstack/react-query'
import { getClassOptions } from '../api/getClassOptions'
import { studentKeys } from '../api/studentKeys'

export function useClassOptions() {
  return useQuery({
    queryKey: studentKeys.classOptions(),
    queryFn: getClassOptions,
    // Classes change a few times a year; no need to refetch while the page is open.
    staleTime: Infinity,
  })
}
