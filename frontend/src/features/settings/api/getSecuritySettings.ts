import { api } from '@/lib/api/client'
import { securitySettingsSchema } from '../schemas/securitySettings.schema'
import type { SecuritySettings } from '../types/settings.types'
import { readSampleSecuritySettings } from './sample/sampleSecuritySettings'

export async function getSecuritySettings(): Promise<SecuritySettings> {
  if (import.meta.env.MODE === 'test') {
    return securitySettingsSchema.parse(readSampleSecuritySettings())
  }
  return api.get('/settings/school/security', securitySettingsSchema)
}
