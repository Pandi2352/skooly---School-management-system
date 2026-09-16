import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSystemSettings } from '../api/getSystemSettings'
import { settingsKeys } from '../api/settingsKeys'
import { updateSystemSettings } from '../api/updateSystemSettings'

export function useSystemSettings() {
  return useQuery({ queryKey: settingsKeys.systemSettings(), queryFn: getSystemSettings })
}

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSystemSettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(settingsKeys.systemSettings(), saved)
    },
  })
}
