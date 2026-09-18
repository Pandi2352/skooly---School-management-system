import { api } from '@/lib/api/client'
import { systemSettingsSchema } from '../schemas/systemSettings.schema'
import type { SystemSettings } from '../types/settings.types'
import { writeSampleSystemSettings } from './sample/sampleSystemSettings'

export async function updateSystemSettings(values: SystemSettings): Promise<SystemSettings> {
  if (import.meta.env.MODE === 'test') {
    return systemSettingsSchema.parse(writeSampleSystemSettings(systemSettingsSchema.parse(values)))
  }
  return api.put('/settings/school/system', systemSettingsSchema, values)
}
