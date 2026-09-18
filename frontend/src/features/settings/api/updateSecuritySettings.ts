import { api } from '@/lib/api/client'
import { securitySettingsSchema } from '../schemas/securitySettings.schema'
import type { SecuritySettings } from '../types/settings.types'
import { writeSampleSecuritySettings } from './sample/sampleSecuritySettings'

export async function updateSecuritySettings(values: SecuritySettings): Promise<SecuritySettings> {
  if (import.meta.env.MODE === 'test') {
    return securitySettingsSchema.parse(writeSampleSecuritySettings(securitySettingsSchema.parse(values)))
  }
  return api.put('/settings/school/security', securitySettingsSchema, values)
}
