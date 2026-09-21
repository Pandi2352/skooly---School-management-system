import type { ReactNode } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { paths } from '@/app/paths'
import { RequirePermission } from '@/features/auth/guards/RequirePermission'
import { ADMISSION_PERMISSIONS } from '@/features/admissions/constants/admissionPermissions'

/** The menu hides these without permission; the guard covers a typed URL or an old bookmark. */
const guard = (children: ReactNode, pageName: string) => (
  <RequirePermission permission={ADMISSION_PERMISSIONS.view} pageName={pageName}>
    {children}
  </RequirePermission>
)

export const admissionRoutes: RouteObject[] = [
  {
    path: 'admissions',
    children: [
      { index: true, element: <Navigate to={paths.admissionsOverview} replace /> },
      {
        path: 'overview',
        lazy: async () => {
          const { AdmissionsOverviewPage } = await import(
            '@/features/admissions/pages/AdmissionsOverviewPage'
          )
          return { element: guard(<AdmissionsOverviewPage />, 'Admissions Overview') }
        },
      },
      {
        path: 'applications',
        lazy: async () => {
          const { AdmissionsEnrollmentPage } = await import(
            '@/features/admissions/pages/AdmissionsEnrollmentPage'
          )
          return { element: guard(<AdmissionsEnrollmentPage />, 'Applications Pipeline') }
        },
      },
      {
        path: 'enrollment',
        lazy: async () => {
          const { AdmissionsEnrollmentPage } = await import(
            '@/features/admissions/pages/AdmissionsEnrollmentPage'
          )
          return { element: guard(<AdmissionsEnrollmentPage />, 'Enrollment Desk') }
        },
      },
      {
        path: 'inquiries',
        lazy: async () => {
          const { AdmissionsInquiriesPage } = await import(
            '@/features/admissions/pages/AdmissionsInquiriesPage'
          )
          return { element: guard(<AdmissionsInquiriesPage />, 'Inquiries & Leads') }
        },
      },
      {
        path: 'assessments',
        lazy: async () => {
          const { AdmissionsAssessmentsPage } = await import(
            '@/features/admissions/pages/AdmissionsAssessmentsPage'
          )
          return { element: guard(<AdmissionsAssessmentsPage />, 'Merit & Assessments') }
        },
      },
      {
        path: 'settings',
        lazy: async () => {
          const { AdmissionSettingsPage, ADMISSION_SETTINGS_PERMISSIONS } = await import(
            '@/features/admissionSettings'
          )
          return {
            element: (
              <RequirePermission
                permission={ADMISSION_SETTINGS_PERMISSIONS.view}
                pageName="Admission Settings"
              >
                <AdmissionSettingsPage />
              </RequirePermission>
            ),
          }
        },
      },
      {
        // Anything else in this menu that isn't built yet. Without it these
        // addresses fall through this module's routes and render a blank page.
        path: ':featureSlug',
        lazy: async () => {
          const { PlannedFeaturePage } = await import('@/pages/PlannedFeaturePage')
          return { element: <PlannedFeaturePage moduleSlug="admissions" /> }
        },
      },
    ],
  },
]
