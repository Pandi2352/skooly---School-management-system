import { api } from '@/lib/api/client'
import { schoolProfileSchema } from '../schemas/schoolProfile.schema'
import type { SchoolProfile } from '../types/settings.types'
import { readSampleSchoolProfile } from './sample/sampleSchoolProfile'

export async function getSchoolProfile(): Promise<SchoolProfile> {
  if (import.meta.env.MODE === 'test') {
    return schoolProfileSchema.parse(readSampleSchoolProfile())
  }
  return api.get('/settings/school/profile', schoolProfileSchema)
}
