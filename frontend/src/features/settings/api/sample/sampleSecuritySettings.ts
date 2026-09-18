import type { SecuritySettings } from '../../types/settings.types'

let security: SecuritySettings = {
  sessionIdleMinutes: 30,
  rememberMeEnabled: true,
  rememberMeDays: 30,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  passwordMinLength: 8,
  requireSpecialChar: true,
  requireNumber: true,
  requireUppercase: true,
  twoFactorEnforcement: 'optional',
}

export const readSampleSecuritySettings = (): SecuritySettings => security

export function writeSampleSecuritySettings(next: SecuritySettings): SecuritySettings {
  security = next
  return security
}
