import { z } from 'zod'

export const securitySettingsSchema = z.object({
  sessionIdleMinutes: z.number().int().min(5, 'Session timeout must be at least 5 minutes').max(1440, 'Session timeout cannot exceed 1440 minutes (24 hours)'),
  rememberMeEnabled: z.boolean(),
  rememberMeDays: z.number().int().min(1, 'Remember duration must be at least 1 day').max(90, 'Remember duration cannot exceed 90 days'),
  maxLoginAttempts: z.number().int().min(3, 'Minimum threshold is 3 attempts').max(20, 'Maximum threshold is 20 attempts'),
  lockoutDurationMinutes: z.number().int().min(1, 'Lockout must be at least 1 minute').max(1440, 'Lockout cannot exceed 1440 minutes'),
  passwordMinLength: z.number().int().min(8, 'Password length must be at least 8 characters').max(32, 'Password length cannot exceed 32 characters'),
  requireSpecialChar: z.boolean(),
  requireNumber: z.boolean(),
  requireUppercase: z.boolean(),
  twoFactorEnforcement: z.enum(['optional', 'required-admins', 'required-all']),
})

export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>
