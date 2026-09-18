import type { RouteObject } from 'react-router-dom'

export const admissionsRoutes: RouteObject[] = [
  {
    path: 'core-setup-administration/admissions-enrollment',
    lazy: async () => ({
      Component: (await import('@/features/admissions/pages/AdmissionsEnrollmentPage'))
        .AdmissionsEnrollmentPage,
    }),
  },
]
