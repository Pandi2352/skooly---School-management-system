import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import {
  ATTENDANCE_TRACKING_MODES,
  CURRENCIES,
  DATE_FORMATS,
  DEFAULT_ATTENDANCE_SETTINGS,
  DEFAULT_INTEGRATIONS_SETTINGS,
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SYSTEM_SETTINGS,
  EMAIL_PROVIDERS,
  RECEIPT_TEMPLATES,
  SATURDAY_RULES,
  SEQUENCE_PADDINGS,
  SEQUENCE_SEPARATORS,
  SESSION_FORMATS,
  SMS_PROVIDERS,
  TWO_FACTOR_ENFORCEMENT_OPTIONS,
  WEEKDAYS,
  WHATSAPP_PROVIDERS,
  type AttendanceTrackingMode,
  type Currency,
  type DateFormat,
  type EmailProvider,
  type ReceiptTemplate,
  type SaturdayRule,
  type SequencePadding,
  type SequenceSeparator,
  type SessionFormat,
  type SmsProvider,
  type TwoFactorEnforcement,
  type Weekday,
  type WhatsAppProvider,
} from '../constants/school-settings.constants'

@Schema({ _id: false })
export class SchoolProfileEmbedded {
  @ApiProperty({ description: 'Full school name', example: 'Skooly International Academy' })
  @Prop({ required: true, trim: true, default: DEFAULT_SCHOOL_PROFILE.schoolName })
  schoolName: string

  @ApiProperty({ description: 'Short abbreviation for the school', example: 'SIA' })
  @Prop({ default: DEFAULT_SCHOOL_PROFILE.shortName, trim: true })
  shortName: string

  @ApiProperty({ description: 'School administrative contact email', example: 'office@skooly.edu' })
  @Prop({ required: true, trim: true, default: DEFAULT_SCHOOL_PROFILE.email })
  email: string

  @ApiProperty({ description: 'School contact phone', example: '+91 98765 43210' })
  @Prop({ default: DEFAULT_SCHOOL_PROFILE.phone, trim: true })
  phone: string

  @ApiProperty({ description: 'Head of Institution / Principal name', example: 'Dr. Arthur Pendelton' })
  @Prop({ default: DEFAULT_SCHOOL_PROFILE.principalName, trim: true })
  principalName: string

  @ApiProperty({ description: 'Country code (ISO-2)', example: 'IN' })
  @Prop({ required: true, default: DEFAULT_SCHOOL_PROFILE.country })
  country: string

  @ApiProperty({ description: 'School physical street and postal address' })
  @Prop({ default: DEFAULT_SCHOOL_PROFILE.address, trim: true })
  address: string
}

export const SchoolProfileEmbeddedSchema = SchemaFactory.createForClass(SchoolProfileEmbedded)

@Schema({ _id: false })
export class SequenceRuleEmbedded {
  @ApiProperty({ description: 'Prefix letters/characters', example: 'ROLL' })
  @Prop({ default: 'ROLL', trim: true })
  prefix: string

  @ApiProperty({ description: 'Separator character between parts', enum: SEQUENCE_SEPARATORS, example: 'slash' })
  @Prop({ required: true, enum: SEQUENCE_SEPARATORS, default: 'slash' })
  separator: SequenceSeparator

  @ApiProperty({ description: 'Minimum number of digits (zero-padded)', enum: SEQUENCE_PADDINGS, example: '3' })
  @Prop({ required: true, enum: SEQUENCE_PADDINGS, default: '3' })
  padding: SequencePadding

  @ApiProperty({ description: 'Whether to include the academic session', example: true })
  @Prop({ required: true, default: true })
  includeSession: boolean

  @ApiProperty({ description: 'Academic session format', enum: SESSION_FORMATS, example: 'short' })
  @Prop({ required: true, enum: SESSION_FORMATS, default: 'short' })
  sessionFormat: SessionFormat
}

export const SequenceRuleEmbeddedSchema = SchemaFactory.createForClass(SequenceRuleEmbedded)

@Schema({ _id: false })
export class DatedSequenceRuleEmbedded extends SequenceRuleEmbedded {
  @ApiProperty({ description: 'Whether to include date tokens', example: true })
  @Prop({ required: true, default: true })
  includeDate: boolean

  @ApiProperty({ description: 'Date stamp format', enum: DATE_FORMATS, example: 'yy' })
  @Prop({ required: true, enum: DATE_FORMATS, default: 'yy' })
  dateFormat: DateFormat

  @ApiProperty({ description: 'Next counter value to issue', example: 1 })
  @Prop({ required: true, default: 1, min: 1 })
  nextNumber: number
}

export const DatedSequenceRuleEmbeddedSchema = SchemaFactory.createForClass(DatedSequenceRuleEmbedded)

@Schema({ _id: false })
export class SystemSettingsEmbedded {
  @ApiProperty({ description: 'Institutional school affiliation code', example: 'SIA-KA-001' })
  @Prop({ default: DEFAULT_SYSTEM_SETTINGS.schoolCode, trim: true })
  schoolCode: string

  @ApiProperty({ description: 'Affiliating authority or board', example: 'Central Board of Secondary Education' })
  @Prop({ default: DEFAULT_SYSTEM_SETTINGS.affiliatedBy, trim: true })
  affiliatedBy: string

  @ApiProperty({ description: 'Base operating currency', enum: CURRENCIES, example: 'INR' })
  @Prop({ required: true, enum: CURRENCIES, default: DEFAULT_SYSTEM_SETTINGS.currency })
  currency: Currency

  @ApiProperty({ description: 'Document print layout for fee receipts', enum: RECEIPT_TEMPLATES, example: 'standard-a4' })
  @Prop({ required: true, enum: RECEIPT_TEMPLATES, default: DEFAULT_SYSTEM_SETTINGS.receiptTemplate })
  receiptTemplate: ReceiptTemplate

  @ApiProperty({ type: DatedSequenceRuleEmbedded, description: 'Fee receipt numbering sequence' })
  @Prop({ type: DatedSequenceRuleEmbeddedSchema, default: () => DEFAULT_SYSTEM_SETTINGS.feeReceipt })
  feeReceipt: DatedSequenceRuleEmbedded

  @ApiProperty({ type: DatedSequenceRuleEmbedded, description: 'Student admission numbering sequence' })
  @Prop({ type: DatedSequenceRuleEmbeddedSchema, default: () => DEFAULT_SYSTEM_SETTINGS.admission })
  admission: DatedSequenceRuleEmbedded

  @ApiProperty({ type: SequenceRuleEmbedded, description: 'Roll numbering format' })
  @Prop({ type: SequenceRuleEmbeddedSchema, default: () => DEFAULT_SYSTEM_SETTINGS.roll })
  roll: SequenceRuleEmbedded
}

export const SystemSettingsEmbeddedSchema = SchemaFactory.createForClass(SystemSettingsEmbedded)

@Schema({ _id: false })
export class SecuritySettingsEmbedded {
  @ApiProperty({ description: 'Inactivity minutes before automatic logout', example: 30 })
  @Prop({ required: true, default: DEFAULT_SECURITY_SETTINGS.sessionIdleMinutes, min: 5, max: 1440 })
  sessionIdleMinutes: number

  @ApiProperty({ description: 'Allow extended session tokens when remember me is checked', example: true })
  @Prop({ required: true, default: DEFAULT_SECURITY_SETTINGS.rememberMeEnabled })
  rememberMeEnabled: boolean

  @ApiProperty({ description: 'Duration in days for persistent sessions', example: 30 })
  @Prop({ required: true, default: DEFAULT_SECURITY_SETTINGS.rememberMeDays, min: 1, max: 90 })
  rememberMeDays: number

  @ApiProperty({ description: 'Maximum consecutive failed login attempts before lockout', example: 5 })
  @Prop({ required: true, default: DEFAULT_SECURITY_SETTINGS.maxLoginAttempts, min: 3, max: 20 })
  maxLoginAttempts: number

  @ApiProperty({ description: 'Lockout duration in minutes after exceeding attempts', example: 15 })
  @Prop({ required: true, default: DEFAULT_SECURITY_SETTINGS.lockoutDurationMinutes, min: 1, max: 1440 })
  lockoutDurationMinutes: number

  @ApiProperty({ description: 'Minimum required password length', example: 8 })
  @Prop({ required: true, default: DEFAULT_SECURITY_SETTINGS.passwordMinLength, min: 8, max: 32 })
  passwordMinLength: number

  @ApiProperty({ description: 'Require at least one special character in passwords', example: true })
  @Prop({ required: true, default: DEFAULT_SECURITY_SETTINGS.requireSpecialChar })
  requireSpecialChar: boolean

  @ApiProperty({ description: 'Require at least one numeric digit in passwords', example: true })
  @Prop({ required: true, default: DEFAULT_SECURITY_SETTINGS.requireNumber })
  requireNumber: boolean

  @ApiProperty({ description: 'Require at least one uppercase letter in passwords', example: true })
  @Prop({ required: true, default: DEFAULT_SECURITY_SETTINGS.requireUppercase })
  requireUppercase: boolean

  @ApiProperty({
    description: 'Staff two-factor authentication enforcement policy',
    enum: TWO_FACTOR_ENFORCEMENT_OPTIONS,
    example: 'optional',
  })
  @Prop({
    required: true,
    enum: TWO_FACTOR_ENFORCEMENT_OPTIONS,
    default: DEFAULT_SECURITY_SETTINGS.twoFactorEnforcement,
  })
  twoFactorEnforcement: TwoFactorEnforcement
}

export const SecuritySettingsEmbeddedSchema = SchemaFactory.createForClass(SecuritySettingsEmbedded)

@Schema({ _id: false })
export class AttendanceSettingsEmbedded {
  @ApiProperty({ description: 'Attendance recording frequency/mode', enum: ATTENDANCE_TRACKING_MODES, example: 'daily' })
  @Prop({ required: true, enum: ATTENDANCE_TRACKING_MODES, default: DEFAULT_ATTENDANCE_SETTINGS.trackingMode })
  trackingMode: AttendanceTrackingMode

  @ApiProperty({
    description: 'Official operational working weekdays',
    example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  })
  @Prop({ type: [String], enum: WEEKDAYS, default: DEFAULT_ATTENDANCE_SETTINGS.workingDays })
  workingDays: Weekday[]

  @ApiProperty({ description: 'Operating rule for Saturdays', enum: SATURDAY_RULES, example: 'alternate' })
  @Prop({ required: true, enum: SATURDAY_RULES, default: DEFAULT_ATTENDANCE_SETTINGS.saturdayRule })
  saturdayRule: SaturdayRule

  @ApiProperty({ description: 'Official morning check-in cutoff time (HH:mm)', example: '08:30' })
  @Prop({ required: true, default: DEFAULT_ATTENDANCE_SETTINGS.checkInTime })
  checkInTime: string

  @ApiProperty({ description: 'Grace period in minutes before student is marked late', example: 15 })
  @Prop({ required: true, default: DEFAULT_ATTENDANCE_SETTINGS.lateThresholdMinutes, min: 0, max: 60 })
  lateThresholdMinutes: number

  @ApiProperty({ description: 'Hours of presence required for a half-day credit', example: 3.5 })
  @Prop({ required: true, default: DEFAULT_ATTENDANCE_SETTINGS.halfDayThresholdHours, min: 1, max: 8 })
  halfDayThresholdHours: number

  @ApiProperty({ description: 'Minimum annual attendance percentage required for academic eligibility', example: 75 })
  @Prop({ required: true, default: DEFAULT_ATTENDANCE_SETTINGS.minimumAttendancePercentage, min: 50, max: 100 })
  minimumAttendancePercentage: number

  @ApiProperty({ description: 'Send SMS/email notification to guardians on unauthorized absence', example: true })
  @Prop({ required: true, default: DEFAULT_ATTENDANCE_SETTINGS.notifyAbsenceToParents })
  notifyAbsenceToParents: boolean

  @ApiProperty({ description: 'Time of day when absence digest notifications are dispatched', example: '10:00' })
  @Prop({ required: true, default: DEFAULT_ATTENDANCE_SETTINGS.absenceNotificationTime })
  absenceNotificationTime: string
}

export const AttendanceSettingsEmbeddedSchema = SchemaFactory.createForClass(AttendanceSettingsEmbedded)

@Schema({ _id: false })
export class EmailIntegrationEmbedded {
  @ApiProperty({ description: 'Email transmission service provider', enum: EMAIL_PROVIDERS, example: 'smtp' })
  @Prop({ required: true, enum: EMAIL_PROVIDERS, default: DEFAULT_INTEGRATIONS_SETTINGS.email.provider })
  provider: EmailProvider

  @ApiProperty({ description: 'Outgoing SMTP server hostname', example: 'smtp.mailgun.org' })
  @Prop({ default: DEFAULT_INTEGRATIONS_SETTINGS.email.host, trim: true })
  host: string

  @ApiProperty({ description: 'SMTP server port', example: 587 })
  @Prop({ required: true, default: DEFAULT_INTEGRATIONS_SETTINGS.email.port })
  port: number

  @ApiProperty({ description: 'Use SSL/TLS secure transport', example: false })
  @Prop({ required: true, default: DEFAULT_INTEGRATIONS_SETTINGS.email.secure })
  secure: boolean

  @ApiProperty({ description: 'SMTP authentication username', example: 'postmaster@skooly.edu' })
  @Prop({ default: DEFAULT_INTEGRATIONS_SETTINGS.email.username, trim: true })
  username: string

  @ApiProperty({ description: 'Encrypted SMTP password/token stored securely in database', required: false })
  @Prop({ default: '' })
  passwordEncrypted?: string

  @ApiProperty({ description: 'Default sender email address', example: 'notifications@skooly.edu' })
  @Prop({ default: DEFAULT_INTEGRATIONS_SETTINGS.email.fromEmail, trim: true })
  fromEmail: string

  @ApiProperty({ description: 'Default sender display name', example: 'Skooly International Academy' })
  @Prop({ default: DEFAULT_INTEGRATIONS_SETTINGS.email.fromName, trim: true })
  fromName: string
}

export const EmailIntegrationEmbeddedSchema = SchemaFactory.createForClass(EmailIntegrationEmbedded)

@Schema({ _id: false })
export class SmsIntegrationEmbedded {
  @ApiProperty({ description: 'SMS gateway service provider', enum: SMS_PROVIDERS, example: 'disabled' })
  @Prop({ required: true, enum: SMS_PROVIDERS, default: DEFAULT_INTEGRATIONS_SETTINGS.sms.provider })
  provider: SmsProvider

  @ApiProperty({ description: 'Approved telecommunication sender identifier', example: 'SKOOLY' })
  @Prop({ default: DEFAULT_INTEGRATIONS_SETTINGS.sms.senderId, trim: true })
  senderId: string

  @ApiProperty({ description: 'DLT Registered Entity Header / Principal ID', example: '1101552390001' })
  @Prop({ default: DEFAULT_INTEGRATIONS_SETTINGS.sms.dltEntityId, trim: true })
  dltEntityId: string

  @ApiProperty({ description: 'Encrypted SMS API auth token / key', required: false })
  @Prop({ default: '' })
  apiKeyEncrypted?: string
}

export const SmsIntegrationEmbeddedSchema = SchemaFactory.createForClass(SmsIntegrationEmbedded)

@Schema({ _id: false })
export class WhatsAppIntegrationEmbedded {
  @ApiProperty({ description: 'Whether WhatsApp messaging is activated', example: false })
  @Prop({ required: true, default: DEFAULT_INTEGRATIONS_SETTINGS.whatsapp.enabled })
  enabled: boolean

  @ApiProperty({ description: 'WhatsApp Business API solution partner', enum: WHATSAPP_PROVIDERS, example: 'disabled' })
  @Prop({ required: true, enum: WHATSAPP_PROVIDERS, default: DEFAULT_INTEGRATIONS_SETTINGS.whatsapp.provider })
  provider: WhatsAppProvider

  @ApiProperty({ description: 'Official WhatsApp Business telephone number with country code', example: '+919876543210' })
  @Prop({ default: DEFAULT_INTEGRATIONS_SETTINGS.whatsapp.businessPhoneNumber, trim: true })
  businessPhoneNumber: string

  @ApiProperty({ description: 'Encrypted WhatsApp API auth secret', required: false })
  @Prop({ default: '' })
  apiKeyEncrypted?: string
}

export const WhatsAppIntegrationEmbeddedSchema = SchemaFactory.createForClass(WhatsAppIntegrationEmbedded)

@Schema({ _id: false })
export class IntegrationsSettingsEmbedded {
  @ApiProperty({ type: EmailIntegrationEmbedded, description: 'Transactional and alert email configuration' })
  @Prop({ type: EmailIntegrationEmbeddedSchema, default: () => DEFAULT_INTEGRATIONS_SETTINGS.email })
  email: EmailIntegrationEmbedded

  @ApiProperty({ type: SmsIntegrationEmbedded, description: 'SMS gateway and DLT credentials configuration' })
  @Prop({ type: SmsIntegrationEmbeddedSchema, default: () => DEFAULT_INTEGRATIONS_SETTINGS.sms })
  sms: SmsIntegrationEmbedded

  @ApiProperty({ type: WhatsAppIntegrationEmbedded, description: 'WhatsApp Business communication configuration' })
  @Prop({ type: WhatsAppIntegrationEmbeddedSchema, default: () => DEFAULT_INTEGRATIONS_SETTINGS.whatsapp })
  whatsapp: WhatsAppIntegrationEmbedded
}

export const IntegrationsSettingsEmbeddedSchema = SchemaFactory.createForClass(IntegrationsSettingsEmbedded)

export type SchoolSettingsDocument = HydratedDocument<SchoolSettings>

/** Singleton school settings record: institutional profile, system formats, security, attendance, and integrations. */
@Schema({ collection: 'school_settings', timestamps: true, versionKey: false })
export class SchoolSettings extends BaseSchema {
  @ApiProperty({ description: 'Fixed key ensuring a single institutional configuration', example: 'school_settings' })
  @Prop({ required: true })
  singletonKey: string

  @ApiProperty({ type: SchoolProfileEmbedded, description: 'Institutional profile details' })
  @Prop({ type: SchoolProfileEmbeddedSchema, default: () => DEFAULT_SCHOOL_PROFILE })
  profile: SchoolProfileEmbedded

  @ApiProperty({ type: SystemSettingsEmbedded, description: 'System formatting and running numbering sequences' })
  @Prop({ type: SystemSettingsEmbeddedSchema, default: () => DEFAULT_SYSTEM_SETTINGS })
  system: SystemSettingsEmbedded

  @ApiProperty({ type: SecuritySettingsEmbedded, description: 'Security, session duration, and authentication policies' })
  @Prop({ type: SecuritySettingsEmbeddedSchema, default: () => DEFAULT_SECURITY_SETTINGS })
  security: SecuritySettingsEmbedded

  @ApiProperty({ type: AttendanceSettingsEmbedded, description: 'Attendance tracking, working schedule, and notification rules' })
  @Prop({ type: AttendanceSettingsEmbeddedSchema, default: () => DEFAULT_ATTENDANCE_SETTINGS })
  attendance: AttendanceSettingsEmbedded

  @ApiProperty({ type: IntegrationsSettingsEmbedded, description: 'External communications and gateway integrations' })
  @Prop({ type: IntegrationsSettingsEmbeddedSchema, default: () => DEFAULT_INTEGRATIONS_SETTINGS })
  integrations: IntegrationsSettingsEmbedded
}

export const SchoolSettingsSchema = SchemaFactory.createForClass(SchoolSettings)

SchoolSettingsSchema.index({ singletonKey: 1 }, { unique: true, name: 'uniq_school_settings_singleton' })
