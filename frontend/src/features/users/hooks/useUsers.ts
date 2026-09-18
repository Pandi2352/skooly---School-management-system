import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userKeys } from '../api/userKeys'
import {
  archiveUser,
  changeUserRole,
  changeUserStatus,
  createUser,
  getUser,
  getUserSessions,
  getUsers,
  resendInvitation,
  revokeUserSessions,
  sendPasswordReset,
  setTemporaryPassword,
  updateUser,
  type UserListQuery,
} from '../api/users'

export function useUsers(query: UserListQuery) {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: () => getUsers(query),
    // Keeps the table on screen while a new page or filter loads, instead of flashing empty.
    placeholderData: (previous) => previous,
  })
}

export function useUser(id: string) {
  return useQuery({ queryKey: userKeys.detail(id), queryFn: () => getUser(id), enabled: id !== '' })
}

export function useUserSessions(id: string) {
  return useQuery({
    queryKey: userKeys.sessions(id),
    queryFn: () => getUserSessions(id),
    enabled: id !== '',
  })
}

/** Any change to an account can move it between the status counts, so the whole list is refreshed. */
function useRefreshUsers() {
  const queryClient = useQueryClient()
  return (id?: string) => {
    void queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    if (id) void queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
  }
}

export function useCreateUser() {
  const refresh = useRefreshUsers()
  return useMutation({ mutationFn: createUser, onSuccess: () => refresh() })
}

export function useUpdateUser() {
  const refresh = useRefreshUsers()
  return useMutation({ mutationFn: updateUser, onSuccess: (user) => refresh(user.id) })
}

export function useChangeUserRole() {
  const refresh = useRefreshUsers()
  return useMutation({ mutationFn: changeUserRole, onSuccess: (user) => refresh(user.id) })
}

export function useChangeUserStatus() {
  const refresh = useRefreshUsers()
  return useMutation({ mutationFn: changeUserStatus, onSuccess: (user) => refresh(user.id) })
}

export function useArchiveUser() {
  const refresh = useRefreshUsers()
  return useMutation({ mutationFn: archiveUser, onSuccess: (user) => refresh(user.id) })
}

export function useResendInvitation() {
  const refresh = useRefreshUsers()
  return useMutation({ mutationFn: resendInvitation, onSuccess: (result) => refresh(result.user.id) })
}

export function useSendPasswordReset() {
  return useMutation({ mutationFn: sendPasswordReset })
}

export function useSetTemporaryPassword() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: setTemporaryPassword,
    onSuccess: (result) => refresh(result.user.id),
  })
}

export function useRevokeUserSessions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeUserSessions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}
