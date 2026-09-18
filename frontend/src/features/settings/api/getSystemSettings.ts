import { api } from '@/lib/api/client'
import { systemSettingsSchema } from '../schemas/systemSettings.schema'
import type { SystemSettings } from '../types/settings.types'
import { readSampleSystemSettings } from './sample/sampleSystemSettings'

export async function getSystemSettings(): Promise<SystemSettings> {
  if (import.meta.env.MODE === 'test') {
    return systemSettingsSchema.parse(readSampleSystemSettings())
  }
  return api.get('/settings/school/system', systemSettingsSchema)
}
