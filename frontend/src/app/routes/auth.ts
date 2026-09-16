import type { RouteObject } from 'react-router-dom'
import { paths } from '@/app/paths'

export const authRoutes: RouteObject[] = [
  {
    path: paths.login,
    lazy: async () => ({
      Component: (await import('@/features/auth/pages/LoginPage')).LoginPage,
    }),
  },
]
