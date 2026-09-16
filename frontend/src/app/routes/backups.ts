import type { RouteObject } from 'react-router-dom'

// Backup Management has no sub-pages, so it is a single route at the module's URL.
export const backupRoutes: RouteObject[] = [
  {
    path: 'backup-management',
    lazy: async () => ({
      Component: (await import('@/features/backups/pages/BackupManagementPage'))
        .BackupManagementPage,
    }),
  },
]
