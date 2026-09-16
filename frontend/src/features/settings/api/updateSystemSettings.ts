import { systemSettingsSchema } from '../schemas/systemSettings.schema'
import type { SystemSettings } from '../types/settings.types'
import { writeSampleSystemSettings } from './sample/sampleSystemSettings'

// A short wait keeps the saving state visible, as it will be with the real API.
const SAMPLE_DELAY_MS = 400

/** TODO(api): return `api.put('/settings/system', systemSettingsSchema, values)` and delete the sample. */
export async function updateSystemSettings(values: SystemSettings): Promise<SystemSettings> {
  await new Promise((resolve) => setTimeout(resolve, SAMPLE_DELAY_MS))
  return systemSettingsSchema.parse(writeSampleSystemSettings(systemSettingsSchema.parse(values)))
}
