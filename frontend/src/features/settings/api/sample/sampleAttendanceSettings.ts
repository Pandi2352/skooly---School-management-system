import type { AttendanceSettings } from '../../types/settings.types'

let attendance: AttendanceSettings = {
  trackingMode: 'daily',
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  saturdayRule: 'alternate',
  checkInTime: '08:30',
  lateThresholdMinutes: 15,
  halfDayThresholdHours: 3.5,
  minimumAttendancePercentage: 75,
  notifyAbsenceToParents: true,
  absenceNotificationTime: '10:00',
}

export const readSampleAttendanceSettings = (): AttendanceSettings => attendance

export function writeSampleAttendanceSettings(next: AttendanceSettings): AttendanceSettings {
  attendance = next
  return attendance
}
