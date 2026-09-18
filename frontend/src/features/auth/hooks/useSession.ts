import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/ApiError'
import { authKeys } from '../api/authKeys'
import {
  changeOwnPassword,
  createFirstAdministrator,
  getCurrentAccount,
  getOwnSessions,
  getSetupState,
  login,
  logout,
  requestPasswordReset,
  revokeOtherSessions,
  revokeOwnSession,
  setPasswordWithToken,
} from '../api/auth'
import type { SignedInUser } from '../types/auth.types'

/**
 * The one query the whole app hangs off: who is signed in, and what they may do.
 *
 * A 401 is the normal answer for a signed-out visitor, not a failure, so it is never retried and
 * never surfaced as an error banner.
 */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: getCurrentAccount,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 401) && failureCount < 2,
    staleTime: 60_000,
  })
}

/** True while the school has no accounts at all, which is when the setup page takes over. */
export function useSetupState() {
  return useQuery({ queryKey: authKeys.setupState(), queryFn: getSetupState, retry: 1, staleTime: 60_000 })
}

function useStartSession() {
  const queryClient = useQueryClient()
  return (account: SignedInUser) => {
    queryClient.setQueryData(authKeys.session(), account)
    void queryClient.invalidateQueries({ queryKey: authKeys.setupState() })
  }
}

export function useLogin() {
  const startSession = useStartSession()
  return useMutation({ mutationFn: login, onSuccess: startSession })
}

export function useCreateFirstAdministrator() {
  const startSession = useStartSession()
  return useMutation({ mutationFn: createFirstAdministrator, onSuccess: startSession })
}

export function useSetPasswordWithToken() {
  const startSession = useStartSession()
  return useMutation({ mutationFn: setPasswordWithToken, onSuccess: startSession })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    // Everything cached belonged to the person signing out, so none of it may stay on screen.
    onSettled: () => queryClient.clear(),
  })
}

export function useChangeOwnPassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: changeOwnPassword,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session() })
      void queryClient.invalidateQueries({ queryKey: authKeys.sessions() })
    },
  })
}

export function useRequestPasswordReset() {
  return useMutation({ mutationFn: requestPasswordReset })
}

export function useOwnSessions() {
  return useQuery({ queryKey: authKeys.sessions(), queryFn: getOwnSessions })
}

export function useRevokeOwnSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeOwnSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.sessions() }),
  })
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.sessions() }),
  })
}
