import type { RouteObject } from 'react-router-dom'

// The signed-in person's own account. No permission needed: everyone manages their own password.
export const accountRoutes: RouteObject[] = [
  {
    path: 'account',
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/features/auth/pages/AccountPage')).AccountPage,
        }),
      },
      {
        path: 'password',
        lazy: async () => ({
          Component: (await import('@/features/auth/pages/AccountPasswordPage')).AccountPasswordPage,
        }),
      },
    ],
  },
]
