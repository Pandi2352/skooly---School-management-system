import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/ApiError'

export const queryClient = new QueryClient({
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
