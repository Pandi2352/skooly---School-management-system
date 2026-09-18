import { api } from '@/lib/api/client'
import { attendanceSettingsSchema } from '../schemas/attendanceSettings.schema'
import type { AttendanceSettings } from '../types/settings.types'
import { writeSampleAttendanceSettings } from './sample/sampleAttendanceSettings'

export async function updateAttendanceSettings(values: AttendanceSettings): Promise<AttendanceSettings> {
  if (import.meta.env.MODE === 'test') {
    return attendanceSettingsSchema.parse(writeSampleAttendanceSettings(attendanceSettingsSchema.parse(values)))
  }
  return api.put('/settings/school/attendance', attendanceSettingsSchema, values)
}
