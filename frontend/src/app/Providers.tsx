import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ToastProvider } from '@/components/ui/toast/ToastProvider'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { BrandingSync } from '@/features/branding'
import { queryClient } from '@/lib/query/queryClient'
import { ThemeProvider } from './theme/ThemeProvider'

// TODO(auth): add AuthProvider here once login exists (FRONTEND.md D2).
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
