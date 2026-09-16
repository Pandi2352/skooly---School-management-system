import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { backupKeys } from '../api/backupKeys'
import { getBackupSchedule, updateBackupSchedule } from '../api/schedule'

export function useBackupSchedule() {
  return useQuery({ queryKey: backupKeys.schedule(), queryFn: getBackupSchedule })
}

export function useUpdateBackupSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBackupSchedule,
    onSuccess: (saved) => {
      queryClient.setQueryData(backupKeys.schedule(), saved)
    },
  })
}
