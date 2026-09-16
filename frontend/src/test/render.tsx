import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/toast/ToastProvider'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { ThemeProvider } from '@/app/theme/ThemeProvider'

/**
 * Renders with the providers a page needs: a fresh query client (no retries), theme, tooltips,
 * toasts and a router.
 */
export function renderWithProviders(ui: ReactElement, { route = '/' }: { route?: string } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
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
