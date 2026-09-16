import { useQuery } from '@tanstack/react-query'
import { admissionKeys } from '../api/admissionKeys'
import { getHouseOptions } from '../api/admissions'

export function useHouseOptions() {
  return useQuery({
    queryKey: admissionKeys.houses(),
    queryFn: getHouseOptions,
    // Houses rarely change; no need to refetch while the form is open.
    staleTime: Infinity,
  })
}
