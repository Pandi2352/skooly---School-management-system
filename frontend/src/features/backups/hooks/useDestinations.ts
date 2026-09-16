import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { backupKeys } from '../api/backupKeys'
import { addDestination, getDestinations, removeDestination } from '../api/destinations'

export function useDestinations() {
  return useQuery({ queryKey: backupKeys.destinations(), queryFn: getDestinations })
}

export function useAddDestination() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addDestination,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: backupKeys.destinations() }),
  })
}

export function useRemoveDestination() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeDestination,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: backupKeys.destinations() }),
  })
}
