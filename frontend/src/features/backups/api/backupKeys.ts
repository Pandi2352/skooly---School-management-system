export const backupKeys = {
  all: ['backups'] as const,
  list: () => [...backupKeys.all, 'list'] as const,
  destinations: () => [...backupKeys.all, 'destinations'] as const,
  schedule: () => [...backupKeys.all, 'schedule'] as const,
}
