import type { RouteObject } from 'react-router-dom'

export const dataTransferRoutes: RouteObject[] = [
  {
    path: 'core-setup-administration/data-import-export',
    lazy: async () => ({
      Component: (await import('@/features/dataTransfer/pages/DataImportExportPage'))
        .DataImportExportPage,
    }),
  },
]
