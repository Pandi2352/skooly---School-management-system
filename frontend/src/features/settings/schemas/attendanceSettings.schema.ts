import { z } from 'zod'

export const weekdaySchema = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

export const attendanceSettingsSchema = z.object({
  trackingMode: z.enum(['daily', 'period']),
  workingDays: z.array(weekdaySchema).min(1, 'Select at least one operating school day'),
  saturdayRule: z.enum(['off', 'full', 'half', 'alternate']),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Enter a valid time in 24-hour HH:mm format (e.g., 08:30)'),
  lateThresholdMinutes: z.number().int().min(0, 'Grace period cannot be negative').max(60, 'Grace period cannot exceed 60 minutes'),
  halfDayThresholdHours: z.number().min(1, 'Minimum threshold is 1 hour').max(8, 'Maximum threshold is 8 hours'),
  minimumAttendancePercentage: z.number().int().min(50, 'Minimum percentage must be at least 50%').max(100, 'Percentage cannot exceed 100%'),
  notifyAbsenceToParents: z.boolean(),
  absenceNotificationTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Enter a valid notification time in 24-hour HH:mm format (e.g., 10:00)'),
})

export type AttendanceSettingsFormData = z.infer<typeof attendanceSettingsSchema>
