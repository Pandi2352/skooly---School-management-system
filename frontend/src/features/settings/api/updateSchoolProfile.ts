import { api } from '@/lib/api/client'
import { schoolProfileSchema } from '../schemas/schoolProfile.schema'
import type { SchoolProfile } from '../types/settings.types'
import { writeSampleSchoolProfile } from './sample/sampleSchoolProfile'

export async function updateSchoolProfile(values: SchoolProfile): Promise<SchoolProfile> {
  if (import.meta.env.MODE === 'test') {
    return schoolProfileSchema.parse(writeSampleSchoolProfile(schoolProfileSchema.parse(values)))
  }
  return api.put('/settings/school/profile', schoolProfileSchema, values)
}
