import { Navigate, type RouteObject } from 'react-router-dom'
import { paths } from '../paths'

export const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    children: [
      { index: true, element: <Navigate to={paths.settingsGeneral} replace /> },
      {
        path: 'school',
        lazy: async () => ({
          Component: (await import('@/features/settings/pages/SchoolSettingsPage'))
            .SchoolSettingsPage,
        }),
      },
      {
        path: 'branding',
        element: <Navigate to={paths.settingsBranding} replace />,
      },
      {
        path: 'audit-trail',
        lazy: async () => {
          const { AuditTrailPage } = await import('@/features/audit/pages/AuditTrailPage')
          const { RequirePermission } = await import('@/features/auth/guards/RequirePermission')
          const { AUDIT_PERMISSIONS } = await import('@/features/audit/constants')
          return {
            element: (
              <RequirePermission permission={AUDIT_PERMISSIONS.view} pageName="Audit Trail">
                <AuditTrailPage />
              </RequirePermission>
            ),
          }
        },
      },
      {
        path: 'roles',
        lazy: async () => ({
          Component: (await import('@/features/roles/pages/RolesPage')).RolesPage,
        }),
      },
      {
        path: 'custom-fields',
        lazy: async () => ({
          Component: (await import('@/features/customFields/pages/CustomFieldsPage'))
            .CustomFieldsPage,
        }),
      },
      {
        path: 'general',
        lazy: async () => ({
          Component: (await import('@/features/settings/pages/GeneralSettingsPage'))
            .GeneralSettingsPage,
        }),
      },
    ],
  },
]
