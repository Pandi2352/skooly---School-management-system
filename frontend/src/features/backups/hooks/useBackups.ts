import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { backupKeys } from '../api/backupKeys'
import { createBackup, deleteBackup, getBackups } from '../api/backups'

export function useBackups() {
  return useQuery({ queryKey: backupKeys.list(), queryFn: getBackups })
}

export function useCreateBackup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBackup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: backupKeys.list() }),
  })
}

export function useDeleteBackup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBackup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: backupKeys.list() }),
  })
}
