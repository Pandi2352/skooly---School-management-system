import type { RouteObject } from 'react-router-dom'

// Pattern for every feature: list at index, then `new`, `:studentId` and `:studentId/edit`
// as those pages are built (FRONTEND.md D5).
export const studentRoutes: RouteObject[] = [
  {
    path: 'students',
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/features/students/pages/StudentListPage')).StudentListPage,
        }),
      },
      {
        // Admission is its own feature (features/admissions) that lives under the students URL.
        path: 'new',
        lazy: async () => ({
          Component: (await import('@/features/admissions/pages/StudentAdmissionPage'))
            .StudentAdmissionPage,
        }),
      },
      {
        path: ':studentId',
        lazy: async () => ({
          Component: (await import('@/features/students/pages/StudentDetailPage'))
            .StudentDetailPage,
        }),
      },
      {
        path: ':studentId/edit',
        lazy: async () => ({
          Component: (await import('@/features/students/pages/StudentEditPage'))
            .StudentEditPage,
        }),
      },
    ],
  },
]
