import { ApiProperty } from '@nestjs/swagger'
import {
  AttendanceTrackingMode,
  Currency,
  DateFormat,
  EmailProvider,
  ReceiptTemplate,
  SaturdayRule,
  SequencePadding,
  SequenceSeparator,
  SessionFormat,
  SmsProvider,
  TwoFactorEnforcement,
  Weekday,
  WhatsAppProvider,
} from '../constants/school-settings.constants'

export class SchoolProfileResponseDto {
  @ApiProperty({ description: 'School name', example: 'Skooly International Academy' })
  schoolName: string

  @ApiProperty({ description: 'Short abbreviation', example: 'SIA' })
  shortName: string

  @ApiProperty({ description: 'Administrative email', example: 'office@skooly.edu' })
  email: string

  @ApiProperty({ description: 'Contact phone', example: '+91 98765 43210' })
  phone: string

  @ApiProperty({ description: 'Principal name', example: 'Dr. Arthur Pendelton' })
  principalName: string

  @ApiProperty({ description: 'Country code (ISO-2)', example: 'IN' })
  country: string

  @ApiProperty({ description: 'Street & postal address' })
  address: string
}

export class SequenceRuleResponseDto {
  @ApiProperty({ example: 'ROLL' })
  prefix: string

  @ApiProperty({ example: 'slash' })
  separator: SequenceSeparator

  @ApiProperty({ example: '3' })
  padding: SequencePadding

  @ApiProperty({ example: true })
  includeSession: boolean

  @ApiProperty({ example: 'short' })
  sessionFormat: SessionFormat
}

export class DatedSequenceRuleResponseDto extends SequenceRuleResponseDto {
  @ApiProperty({ example: true })
  includeDate: boolean

  @ApiProperty({ example: 'yy' })
  dateFormat: DateFormat

  @ApiProperty({ example: 1 })
  nextNumber: number
}

export class SystemSettingsResponseDto {
  @ApiProperty({ example: 'SIA-KA-001' })
  schoolCode: string

  @ApiProperty({ example: 'Central Board of Secondary Education' })
  affiliatedBy: string

  @ApiProperty({ example: 'INR' })
  currency: Currency

  @ApiProperty({ example: 'standard-a4' })
  receiptTemplate: ReceiptTemplate

  @ApiProperty({ type: DatedSequenceRuleResponseDto })
  feeReceipt: DatedSequenceRuleResponseDto

  @ApiProperty({ type: DatedSequenceRuleResponseDto })
  admission: DatedSequenceRuleResponseDto

  @ApiProperty({ type: SequenceRuleResponseDto })
  roll: SequenceRuleResponseDto
}

export class SecuritySettingsResponseDto {
  @ApiProperty({ example: 30 })
  sessionIdleMinutes: number

  @ApiProperty({ example: true })
  rememberMeEnabled: boolean

  @ApiProperty({ example: 30 })
  rememberMeDays: number

  @ApiProperty({ example: 5 })
  maxLoginAttempts: number

  @ApiProperty({ example: 15 })
  lockoutDurationMinutes: number

  @ApiProperty({ example: 8 })
  passwordMinLength: number

  @ApiProperty({ example: true })
  requireSpecialChar: boolean

  @ApiProperty({ example: true })
  requireNumber: boolean

  @ApiProperty({ example: true })
  requireUppercase: boolean

  @ApiProperty({ example: 'optional' })
  twoFactorEnforcement: TwoFactorEnforcement
}

export class AttendanceSettingsResponseDto {
  @ApiProperty({ example: 'daily' })
  trackingMode: AttendanceTrackingMode

  @ApiProperty({ example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] })
  workingDays: Weekday[]

  @ApiProperty({ example: 'alternate' })
  saturdayRule: SaturdayRule

  @ApiProperty({ example: '08:30' })
  checkInTime: string

  @ApiProperty({ example: 15 })
  lateThresholdMinutes: number

  @ApiProperty({ example: 3.5 })
  halfDayThresholdHours: number

  @ApiProperty({ example: 75 })
  minimumAttendancePercentage: number

  @ApiProperty({ example: true })
  notifyAbsenceToParents: boolean

  @ApiProperty({ example: '10:00' })
  absenceNotificationTime: string
}

export class EmailIntegrationResponseDto {
  @ApiProperty({ example: 'smtp' })
  provider: EmailProvider

  @ApiProperty({ example: 'smtp.mailgun.org' })
  host: string

  @ApiProperty({ example: 587 })
  port: number

  @ApiProperty({ example: false })
  secure: boolean

  @ApiProperty({ example: 'postmaster@skooly.edu' })
  username: string

  @ApiProperty({ example: true })
  hasPassword: boolean

  @ApiProperty({ example: 'notifications@skooly.edu' })
  fromEmail: string

  @ApiProperty({ example: 'Skooly International Academy' })
  fromName: string
}

export class SmsIntegrationResponseDto {
  @ApiProperty({ example: 'disabled' })
  provider: SmsProvider

  @ApiProperty({ example: 'SKOOLY' })
  senderId: string

  @ApiProperty({ example: '1101552390001' })
  dltEntityId: string

  @ApiProperty({ example: false })
  isConfigured: boolean
}

export class WhatsAppIntegrationResponseDto {
  @ApiProperty({ example: false })
  enabled: boolean

  @ApiProperty({ example: 'disabled' })
  provider: WhatsAppProvider

  @ApiProperty({ example: '+919876543210' })
  businessPhoneNumber: string

  @ApiProperty({ example: false })
  isConfigured: boolean
}

export class IntegrationsSettingsResponseDto {
  @ApiProperty({ type: EmailIntegrationResponseDto })
  email: EmailIntegrationResponseDto

  @ApiProperty({ type: SmsIntegrationResponseDto })
  sms: SmsIntegrationResponseDto

  @ApiProperty({ type: WhatsAppIntegrationResponseDto })
  whatsapp: WhatsAppIntegrationResponseDto
}

export class SchoolSettingsResponseDto {
  @ApiProperty({ type: SchoolProfileResponseDto })
  profile: SchoolProfileResponseDto

  @ApiProperty({ type: SystemSettingsResponseDto })
  system: SystemSettingsResponseDto

  @ApiProperty({ type: SecuritySettingsResponseDto })
  security: SecuritySettingsResponseDto

  @ApiProperty({ type: AttendanceSettingsResponseDto })
  attendance: AttendanceSettingsResponseDto

  @ApiProperty({ type: IntegrationsSettingsResponseDto })
  integrations: IntegrationsSettingsResponseDto

  @ApiProperty({ example: '2026-09-18T10:00:00.000Z' })
  updatedAt: Date
}
