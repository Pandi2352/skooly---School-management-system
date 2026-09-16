import { useQuery } from '@tanstack/react-query'
import { admissionKeys } from '../api/admissionKeys'
import { getFeeGroups } from '../api/admissions'

export function useFeeGroups() {
  return useQuery({ queryKey: admissionKeys.feeGroups(), queryFn: getFeeGroups })
}
