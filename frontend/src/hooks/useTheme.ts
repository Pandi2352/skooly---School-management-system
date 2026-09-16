import { use } from 'react'
import { ThemeContext } from '@/app/theme/themeContext'
import { invariant } from '@/lib/assert'

export function useTheme() {
  const context = use(ThemeContext)
  invariant(context, 'useTheme must be used inside <ThemeProvider>')
  return context
}
