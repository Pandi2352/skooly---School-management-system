import type { RouteObject } from 'react-router-dom'

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    lazy: async () => ({
      Component: (await import('@/features/dashboard/pages/DashboardPage')).DashboardPage,
    }),
  },
]
