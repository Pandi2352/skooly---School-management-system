export const SCHOOL_SETTINGS_SINGLETON_KEY = 'school_settings'

export const CURRENCIES = ['INR', 'BDT', 'NPR', 'LKR', 'AED'] as const
export type Currency = (typeof CURRENCIES)[number]

export const RECEIPT_TEMPLATES = ['standard-a4', 'compact-a5', 'thermal-80mm'] as const
export type ReceiptTemplate = (typeof RECEIPT_TEMPLATES)[number]

export const SEQUENCE_SEPARATORS = ['slash', 'dash', 'dot', 'none'] as const
export type SequenceSeparator = (typeof SEQUENCE_SEPARATORS)[number]

export const SEQUENCE_PADDINGS = ['3', '4', '5', '6'] as const
export type SequencePadding = (typeof SEQUENCE_PADDINGS)[number]

export const SESSION_FORMATS = ['full', 'short'] as const
export type SessionFormat = (typeof SESSION_FORMATS)[number]

export const DATE_FORMATS = ['yy', 'yyyy', 'monyy', 'mmyy'] as const
export type DateFormat = (typeof DATE_FORMATS)[number]

export const DEFAULT_SCHOOL_PROFILE = {
  schoolName: 'Skooly International Academy',
  shortName: 'SIA',
  email: 'office@skooly.edu',
  phone: '+91 98765 43210',
  principalName: 'Dr. Arthur Pendelton',
  country: 'IN',
  address: '14 Academic Avenue, Knowledge Park, Bengaluru, Karnataka 560001',
}

export const DEFAULT_SYSTEM_SETTINGS = {
  schoolCode: 'SIA-KA-001',
  affiliatedBy: 'Central Board of Secondary Education',
  currency: 'INR' as Currency,
  receiptTemplate: 'standard-a4' as ReceiptTemplate,
  feeReceipt: {
    prefix: 'SIA',
    separator: 'slash' as SequenceSeparator,
    padding: '3' as SequencePadding,
    includeSession: true,
    sessionFormat: 'full' as SessionFormat,
    includeDate: true,
    dateFormat: 'yy' as DateFormat,
    nextNumber: 1,
  },
  admission: {
    prefix: 'SIA',
    separator: 'slash' as SequenceSeparator,
    padding: '4' as SequencePadding,
    includeSession: true,
    sessionFormat: 'full' as SessionFormat,
    includeDate: true,
    dateFormat: 'monyy' as DateFormat,
    nextNumber: 1,
  },
  roll: {
    prefix: 'ROLL',
    separator: 'slash' as SequenceSeparator,
    padding: '3' as SequencePadding,
    includeSession: true,
    sessionFormat: 'short' as SessionFormat,
  },
}

export const TWO_FACTOR_ENFORCEMENT_OPTIONS = ['optional', 'required-admins', 'required-all'] as const
export type TwoFactorEnforcement = (typeof TWO_FACTOR_ENFORCEMENT_OPTIONS)[number]

export const DEFAULT_SECURITY_SETTINGS = {
  sessionIdleMinutes: 30,
  rememberMeEnabled: true,
  rememberMeDays: 30,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  passwordMinLength: 8,
  requireSpecialChar: true,
  requireNumber: true,
  requireUppercase: true,
  twoFactorEnforcement: 'optional' as TwoFactorEnforcement,
}

export const ATTENDANCE_TRACKING_MODES = ['daily', 'period'] as const
export type AttendanceTrackingMode = (typeof ATTENDANCE_TRACKING_MODES)[number]

export const SATURDAY_RULES = ['off', 'full', 'half', 'alternate'] as const
export type SaturdayRule = (typeof SATURDAY_RULES)[number]

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const
export type Weekday = (typeof WEEKDAYS)[number]

export const DEFAULT_ATTENDANCE_SETTINGS = {
  trackingMode: 'daily' as AttendanceTrackingMode,
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as Weekday[],
  saturdayRule: 'alternate' as SaturdayRule,
  checkInTime: '08:30',
  lateThresholdMinutes: 15,
  halfDayThresholdHours: 3.5,
  minimumAttendancePercentage: 75,
  notifyAbsenceToParents: true,
  absenceNotificationTime: '10:00',
}

export const EMAIL_PROVIDERS = ['smtp', 'disabled'] as const
export type EmailProvider = (typeof EMAIL_PROVIDERS)[number]

export const SMS_PROVIDERS = ['msg91', 'twilio', 'fast2sms', 'disabled'] as const
export type SmsProvider = (typeof SMS_PROVIDERS)[number]

export const WHATSAPP_PROVIDERS = ['interakt', 'gupshup', 'wati', 'disabled'] as const
export type WhatsAppProvider = (typeof WHATSAPP_PROVIDERS)[number]

export const DEFAULT_INTEGRATIONS_SETTINGS = {
  email: {
    provider: 'smtp' as EmailProvider,
    host: '',
    port: 587,
    secure: false,
    username: '',
    fromEmail: 'notifications@skooly.edu',
    fromName: 'Skooly International Academy',
    hasPassword: false,
  },
  sms: {
    provider: 'disabled' as SmsProvider,
    senderId: 'SKOOLY',
    dltEntityId: '',
    isConfigured: false,
  },
  whatsapp: {
    enabled: false,
    provider: 'disabled' as WhatsAppProvider,
    businessPhoneNumber: '',
    isConfigured: false,
  },
}
