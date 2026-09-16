import { useQuery } from '@tanstack/react-query'
import { admissionKeys } from '../api/admissionKeys'
import { getParentAccounts } from '../api/admissions'

export function useParentAccounts() {
  return useQuery({ queryKey: admissionKeys.parentAccounts(), queryFn: getParentAccounts })
}
