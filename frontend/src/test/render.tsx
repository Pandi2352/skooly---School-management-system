import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { SignedInUser } from '@/features/auth/types/auth.types'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/toast/ToastProvider'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { ThemeProvider } from '@/app/theme/ThemeProvider'
import { authKeys } from '@/features/auth/api/authKeys'
import { SAMPLE_SESSION } from '@/features/auth/api/sample/sampleSession'

/**
 * Renders with the providers a page needs: a fresh query client (no retries), theme, tooltips,
 * toasts and a router.
 *
 * The session is seeded with a full-access sample administrator, so a test renders the page it asked
 * for instead of the sign-in redirect, and the menu isn't filtered down to nothing. Pass
 * `session: null` to render as a signed-out visitor, or another session to test a narrower role.
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', session = SAMPLE_SESSION }: { route?: string; session?: SignedInUser | null } = {},
) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  // Seeded rather than fetched, so components that read it render on the first pass.
  queryClient.setQueryData(authKeys.session(), session)
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ToastProvider>
            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
          </ToastProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}
