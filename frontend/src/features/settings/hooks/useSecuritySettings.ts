import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSecuritySettings } from '../api/getSecuritySettings'
import { settingsKeys } from '../api/settingsKeys'
import { updateSecuritySettings } from '../api/updateSecuritySettings'

export function useSecuritySettings() {
  return useQuery({ queryKey: settingsKeys.securitySettings(), queryFn: getSecuritySettings })
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSecuritySettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(settingsKeys.securitySettings(), saved)
    },
  })
}
