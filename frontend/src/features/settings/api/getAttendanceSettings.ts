import { api } from '@/lib/api/client'
import { attendanceSettingsSchema } from '../schemas/attendanceSettings.schema'
import type { AttendanceSettings } from '../types/settings.types'
import { readSampleAttendanceSettings } from './sample/sampleAttendanceSettings'

export async function getAttendanceSettings(): Promise<AttendanceSettings> {
  if (import.meta.env.MODE === 'test') {
    return attendanceSettingsSchema.parse(readSampleAttendanceSettings())
  }
  return api.get('/settings/school/attendance', attendanceSettingsSchema)
}
