import { schoolProfileSchema } from '../schemas/schoolProfile.schema'
import type { SchoolProfile } from '../types/settings.types'
import { readSampleSchoolProfile } from './sample/sampleSchoolProfile'

/** TODO(api): return `api.get('/settings/school', schoolProfileSchema)` and delete ./sample. */
export async function getSchoolProfile(): Promise<SchoolProfile> {
  await Promise.resolve()
  return schoolProfileSchema.parse(readSampleSchoolProfile())
}
