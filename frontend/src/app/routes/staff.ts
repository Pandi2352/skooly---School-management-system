import type { RouteObject } from 'react-router-dom'

export const staffRoutes: RouteObject[] = [
  {
    path: 'hr-staff-management',
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/features/staff/pages/StaffOverviewPage')).StaffOverviewPage,
        }),
      },
      {
        path: 'staff-management',
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('@/features/staff/pages/StaffListPage')).StaffListPage,
            }),
          },
          {
            path: 'new',
            lazy: async () => ({
              Component: (await import('@/features/staff/pages/StaffEditPage')).StaffEditPage,
            }),
          },
          {
            path: ':staffId',
            lazy: async () => ({
              Component: (await import('@/features/staff/pages/StaffDetailPage')).StaffDetailPage,
            }),
          },
          {
            path: ':staffId/edit',
            lazy: async () => ({
              Component: (await import('@/features/staff/pages/StaffEditPage')).StaffEditPage,
            }),
          },
        ],
      },
      {
        path: 'staff-leave-management',
        lazy: async () => ({
          Component: (await import('@/features/staff/pages/LeavePage')).LeavePage,
        }),
      },
      {
        path: 'teacher-evaluations',
        lazy: async () => ({
          Component: (await import('@/features/staff/pages/EvaluationsPage')).EvaluationsPage,
        }),
      },
      {
        path: 'recruitment-hiring',
        lazy: async () => ({
          Component: (await import('@/features/staff/pages/RecruitmentPage')).RecruitmentPage,
        }),
      },
    ],
  },
]
