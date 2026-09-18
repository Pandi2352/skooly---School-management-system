export const settingsKeys = {
  all: ['settings'] as const,
  schoolProfile: () => [...settingsKeys.all, 'school-profile'] as const,
  systemSettings: () => [...settingsKeys.all, 'system'] as const,
  securitySettings: () => [...settingsKeys.all, 'security'] as const,
  attendanceSettings: () => [...settingsKeys.all, 'attendance'] as const,
  integrationsSettings: () => [...settingsKeys.all, 'integrations'] as const,
}
