import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { roleKeys } from '../api/roleKeys'
import { createRole, deleteRole, getRoles, saveRolePermissions, updateRoleDetails } from '../api/roles'

export function useRoles() {
  return useQuery({ queryKey: roleKeys.list(), queryFn: getRoles })
}

function useRefreshRoles() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: roleKeys.list() })
}

export function useCreateRole() {
  const refresh = useRefreshRoles()
  return useMutation({ mutationFn: createRole, onSuccess: refresh })
}

export function useUpdateRoleDetails() {
  const refresh = useRefreshRoles()
  return useMutation({ mutationFn: updateRoleDetails, onSuccess: refresh })
}

export function useSaveRolePermissions() {
  const refresh = useRefreshRoles()
  return useMutation({ mutationFn: saveRolePermissions, onSuccess: refresh })
}

export function useDeleteRole() {
  const refresh = useRefreshRoles()
  return useMutation({ mutationFn: deleteRole, onSuccess: refresh })
}
