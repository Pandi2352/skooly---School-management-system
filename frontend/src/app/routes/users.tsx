import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'
import { RequirePermission } from '@/features/auth/guards/RequirePermission'
import { USER_PERMISSIONS } from '@/features/users/constants'

/** The menu hides this page without permission; the guard covers a typed URL or an old bookmark. */
const guard = (children: ReactNode) => (
  <RequirePermission permission={USER_PERMISSIONS.view} pageName="User Accounts">
    {children}
  </RequirePermission>
)

export const userRoutes: RouteObject[] = [
  {
    path: 'users',
    children: [
      {
        index: true,
        lazy: async () => {
          const { UsersPage } = await import('@/features/users/pages/UsersPage')
          return { element: guard(<UsersPage />) }
        },
      },
      {
        path: ':userId',
        lazy: async () => {
          const { UserDetailPage } = await import('@/features/users/pages/UserDetailPage')
          return { element: guard(<UserDetailPage />) }
        },
      },
    ],
  },
]
