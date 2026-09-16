import type { RouteObject } from 'react-router-dom'

// "Not built yet" pages for modules in config/navigation.ts. React Router ranks static paths
// (dashboard, students, settings) above `:moduleSlug`, so real features always win. When a
// feature is built, give it its own route file and set `route` on its navigation entry.
export const plannedRoutes: RouteObject[] = [
  {
    path: ':moduleSlug',
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/pages/PlannedModulePage')).PlannedModulePage,
        }),
      },
      {
        path: ':featureSlug',
        lazy: async () => ({
          Component: (await import('@/pages/PlannedFeaturePage')).PlannedFeaturePage,
        }),
      },
    ],
  },
]
