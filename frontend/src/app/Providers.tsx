import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ToastProvider } from '@/components/ui/toast/ToastProvider'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { BrandingSync } from '@/features/branding'
import { queryClient } from '@/lib/query/queryClient'
import { ThemeProvider } from './theme/ThemeProvider'

// The signed-in person is a TanStack Query (features/auth/hooks/useSession), so no extra provider:
// one cache holds the session, and RequireAuth reads it.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ToastProvider>
            <BrandingSync />
            {children}
          </ToastProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
