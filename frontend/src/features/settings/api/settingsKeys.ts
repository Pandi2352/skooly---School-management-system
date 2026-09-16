export const settingsKeys = {
  all: ['settings'] as const,
  schoolProfile: () => [...settingsKeys.all, 'school-profile'] as const,
  systemSettings: () => [...settingsKeys.all, 'system'] as const,
}
