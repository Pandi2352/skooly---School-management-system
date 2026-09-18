import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getIntegrationsSettings } from '../api/getIntegrationsSettings'
import { settingsKeys } from '../api/settingsKeys'
import { updateIntegrationsSettings } from '../api/updateIntegrationsSettings'

export function useIntegrationsSettings() {
  return useQuery({ queryKey: settingsKeys.integrationsSettings(), queryFn: getIntegrationsSettings })
}

export function useUpdateIntegrationsSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateIntegrationsSettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(settingsKeys.integrationsSettings(), saved)
    },
  })
}
