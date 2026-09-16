import { schoolProfileSchema } from '../schemas/schoolProfile.schema'
import type { SchoolProfile } from '../types/settings.types'
import { writeSampleSchoolProfile } from './sample/sampleSchoolProfile'

// A short wait keeps the saving state visible, as it will be with the real API.
const SAMPLE_DELAY_MS = 400

/**
 * TODO(api): send as multipart form data (images as files) with
 * `api.put('/settings/school', schoolProfileSchema, body)`, and delete ./sample.
 */
export async function updateSchoolProfile(values: SchoolProfile): Promise<SchoolProfile> {
  await new Promise((resolve) => setTimeout(resolve, SAMPLE_DELAY_MS))
  return schoolProfileSchema.parse(writeSampleSchoolProfile(schoolProfileSchema.parse(values)))
}
