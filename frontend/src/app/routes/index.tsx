import { Navigate, type RouteObject } from 'react-router-dom'
import { LoadingState } from '@/components/page/LoadingState'
import { RequireAuth } from '@/features/auth/guards/RequireAuth'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { AppLayout } from '../layouts/AppLayout'
import { paths } from '../paths'
import { accountRoutes } from './account'
import { authRoutes } from './auth'
import { backupRoutes } from './backups'
import { dashboardRoutes } from './dashboard'
import { plannedRoutes } from './planned'
import { settingsRoutes } from './settings'
import { studentRoutes } from './students'
import { userRoutes } from './users'
import { templateRoutes } from './templates'
import { admissionsRoutes } from './admissions'

// The route tree. Each area keeps its routes in its own file in this folder.
export const routes: RouteObject[] = [
  ...authRoutes,
  {
    path: paths.root,
    // Nothing inside the app layout renders until we know who is asking.
    element: <RequireAuth />,
    errorElement: <RouteErrorPage standalone />,
    hydrateFallbackElement: <LoadingState label="Loading" />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            // Errors inside a page render here, so the sidebar and navbar stay usable.
            errorElement: <RouteErrorPage />,
            children: [
              { index: true, element: <Navigate to={paths.dashboard} replace /> },
              ...dashboardRoutes,
              ...studentRoutes,
              ...admissionsRoutes,
              ...userRoutes,
              ...accountRoutes,
              ...settingsRoutes,
              ...backupRoutes,
              ...templateRoutes,
              ...plannedRoutes,
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
]
