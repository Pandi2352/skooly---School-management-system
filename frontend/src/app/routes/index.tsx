import { Navigate, type RouteObject } from 'react-router-dom'
import { LoadingState } from '@/components/page/LoadingState'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { AppLayout } from '../layouts/AppLayout'
import { paths } from '../paths'
import { authRoutes } from './auth'
import { backupRoutes } from './backups'
import { dashboardRoutes } from './dashboard'
import { plannedRoutes } from './planned'
import { settingsRoutes } from './settings'
import { studentRoutes } from './students'
import { templateRoutes } from './templates'

// The route tree. Each area keeps its routes in its own file in this folder.
export const routes: RouteObject[] = [
  ...authRoutes,
  {
    path: paths.root,
    element: <AppLayout />,
    errorElement: <RouteErrorPage standalone />,
    hydrateFallbackElement: <LoadingState label="Loading" />,
    children: [
      {
        // Errors inside a page render here, so the sidebar and navbar stay usable.
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <Navigate to={paths.dashboard} replace /> },
          ...dashboardRoutes,
          ...studentRoutes,
          ...settingsRoutes,
          ...backupRoutes,
          ...templateRoutes,
          ...plannedRoutes,
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]
