import { api } from '@/lib/api/client'
import { integrationsSettingsSchema } from '../schemas/integrationsSettings.schema'
import type { IntegrationsSettings } from '../types/settings.types'
import { writeSampleIntegrationsSettings } from './sample/sampleIntegrationsSettings'

export async function updateIntegrationsSettings(values: IntegrationsSettings): Promise<IntegrationsSettings> {
  if (import.meta.env.MODE === 'test') {
    return integrationsSettingsSchema.parse(writeSampleIntegrationsSettings(integrationsSettingsSchema.parse(values)))
  }
  return api.put('/settings/school/integrations', integrationsSettingsSchema, values)
}
