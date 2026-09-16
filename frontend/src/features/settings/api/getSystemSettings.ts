import { systemSettingsSchema } from '../schemas/systemSettings.schema'
import type { SystemSettings } from '../types/settings.types'
import { readSampleSystemSettings } from './sample/sampleSystemSettings'

/** TODO(api): return `api.get('/settings/system', systemSettingsSchema)` and delete the sample. */
export async function getSystemSettings(): Promise<SystemSettings> {
  await Promise.resolve()
  return systemSettingsSchema.parse(readSampleSystemSettings())
}
