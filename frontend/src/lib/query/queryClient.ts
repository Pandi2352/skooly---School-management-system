import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/ApiError'

/**
 * A session can end while the app is open: the person signed out elsewhere, an administrator
 * suspended them, or the session simply expired. Any 401 therefore drops the cached session, and
 * RequireAuth sends them to sign in again on the next render instead of leaving a half-dead page.
 */
const forgetSessionOnUnauthorized = (error: unknown) => {
  if (error instanceof ApiError && error.status === 401) {
    queryClient.setQueryData(['auth', 'session'], null)
  }
}

export const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({ onError: forgetSessionOnUnauthorized }),
  mutationCache: new MutationCache({ onError: forgetSessionOnUnauthorized }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Retry network and server failures, not 4xx: a 404 or 403 won't fix itself.
      retry: (failureCount, error) =>
        failureCount < 2 &&
        !(error instanceof ApiError && error.status >= 400 && error.status < 500),
    },
    mutations: { retry: false },
  },
})
