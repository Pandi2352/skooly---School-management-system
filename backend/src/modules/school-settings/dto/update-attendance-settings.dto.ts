import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator'
import {
  ATTENDANCE_TRACKING_MODES,
  SATURDAY_RULES,
  WEEKDAYS,
  type AttendanceTrackingMode,
  type SaturdayRule,
  type Weekday,
} from '../constants/school-settings.constants'

export class UpdateAttendanceSettingsDto {
  @ApiProperty({ description: 'Attendance recording mode', enum: ATTENDANCE_TRACKING_MODES, example: 'daily' })
  @IsIn(ATTENDANCE_TRACKING_MODES)
  trackingMode: AttendanceTrackingMode

  @ApiProperty({
    description: 'Working weekdays for normal school operations',
    example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(WEEKDAYS, { each: true })
  workingDays: Weekday[]

  @ApiProperty({ description: 'Operating rule for Saturdays', enum: SATURDAY_RULES, example: 'alternate' })
  @IsIn(SATURDAY_RULES)
  saturdayRule: SaturdayRule

  @ApiProperty({ description: 'Morning cutoff check-in time (HH:mm)', example: '08:30' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'checkInTime must be in 24-hour HH:mm format' })
  checkInTime: string

  @ApiProperty({ description: 'Late grace threshold in minutes (0 to 60)', example: 15 })
  @IsInt()
  @Min(0)
  @Max(60)
  lateThresholdMinutes: number

  @ApiProperty({ description: 'Minimum hours needed for half-day credit (1 to 8)', example: 3.5 })
  @IsNumber()
  @Min(1)
  @Max(8)
  halfDayThresholdHours: number

  @ApiProperty({ description: 'Minimum annual attendance percentage (50 to 100)', example: 75 })
  @IsInt()
  @Min(50)
  @Max(100)
  minimumAttendancePercentage: number

  @ApiProperty({ description: 'Send absence alerts to guardians', example: true })
  @IsBoolean()
  notifyAbsenceToParents: boolean

  @ApiProperty({ description: 'Time of day when absence digest is sent (HH:mm)', example: '10:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'absenceNotificationTime must be in 24-hour HH:mm format' })
  absenceNotificationTime: string
}
