import { api } from '@/lib/api/client'
import { integrationsSettingsSchema } from '../schemas/integrationsSettings.schema'
import type { IntegrationsSettings } from '../types/settings.types'
import { readSampleIntegrationsSettings } from './sample/sampleIntegrationsSettings'

export async function getIntegrationsSettings(): Promise<IntegrationsSettings> {
  if (import.meta.env.MODE === 'test') {
    return integrationsSettingsSchema.parse(readSampleIntegrationsSettings())
  }
  return api.get('/settings/school/integrations', integrationsSettingsSchema)
}
