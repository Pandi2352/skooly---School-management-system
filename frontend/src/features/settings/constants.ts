export const SETTINGS_TABS = [
  'profile',
  'branding',
  'system',
  'attendance',
  'security',
  'integrations',
  'social',
  'telegram',
] as const

export const COUNTRY_OPTIONS = [
  { value: 'IN', label: 'India (+91)' },
  { value: 'BD', label: 'Bangladesh (+880)' },
  { value: 'NP', label: 'Nepal (+977)' },
  { value: 'LK', label: 'Sri Lanka (+94)' },
  { value: 'AE', label: 'United Arab Emirates (+971)' },
]

export const CURRENCIES = ['INR', 'BDT', 'NPR', 'LKR', 'AED'] as const

export const CURRENCY_OPTIONS: { value: (typeof CURRENCIES)[number]; label: string }[] = [
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'BDT', label: 'Bangladeshi Taka (৳)' },
  { value: 'NPR', label: 'Nepalese Rupee (Rs)' },
  { value: 'LKR', label: 'Sri Lankan Rupee (Rs)' },
  { value: 'AED', label: 'UAE Dirham (AED)' },
]

export const RECEIPT_TEMPLATES = ['standard-a4', 'compact-a5', 'thermal-80mm'] as const

export const RECEIPT_TEMPLATE_OPTIONS: {
  value: (typeof RECEIPT_TEMPLATES)[number]
  label: string
}[] = [
  { value: 'standard-a4', label: 'Standard receipt (A4 portrait)' },
  { value: 'compact-a5', label: 'Compact receipt (A5 landscape)' },
  { value: 'thermal-80mm', label: 'Thermal receipt (80 mm roll)' },
]

export const SEQUENCE_SEPARATORS = ['slash', 'dash', 'dot', 'none'] as const

export const SEPARATOR_OPTIONS: { value: (typeof SEQUENCE_SEPARATORS)[number]; label: string }[] = [
  { value: 'slash', label: '/ (Slash)' },
  { value: 'dash', label: '- (Dash)' },
  { value: 'dot', label: '. (Dot)' },
  { value: 'none', label: 'None' },
]

export const SEQUENCE_PADDINGS = ['3', '4', '5', '6'] as const

export const PADDING_OPTIONS = SEQUENCE_PADDINGS.map((digits) => ({
  value: digits,
  label: `${digits} digits (${'1'.padStart(Number(digits), '0')})`,
}))

export const SESSION_FORMATS = ['full', 'short'] as const

export const DATE_FORMATS = ['yy', 'yyyy', 'monyy', 'mmyy'] as const

export const PREFIX_MAX_LENGTH = 12

export const TWO_FACTOR_OPTIONS = [
  { value: 'optional', label: 'Optional (Recommended)', description: 'Staff members may choose to enable 2FA on their own accounts.' },
  { value: 'required-admins', label: 'Mandatory for Administrators', description: 'Enforce 2FA for Super Admins and School Admins.' },
  { value: 'required-all', label: 'Mandatory for All Staff', description: 'Enforce 2FA for all teachers, accountants, and staff members.' },
] as const

export const ATTENDANCE_TRACKING_OPTIONS = [
  { value: 'daily', label: 'Once Daily (Morning Roll Call)', description: 'Record student presence once per day during morning homeroom.' },
  { value: 'period', label: 'Per Academic Period / Subject', description: 'Record attendance in each classroom period throughout the timetable.' },
] as const

export const SATURDAY_RULE_OPTIONS = [
  { value: 'off', label: 'All Saturdays Off (5-day week)' },
  { value: 'full', label: 'Full Working Day' },
  { value: 'half', label: 'Half Day (Morning Sessions Only)' },
  { value: 'alternate', label: 'Alternate Saturdays (1st & 3rd Working)' },
] as const

export const WEEKDAY_OPTIONS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const

export const EMAIL_PROVIDER_OPTIONS = [
  { value: 'smtp', label: 'Custom SMTP Server (Recommended)' },
  { value: 'disabled', label: 'Disabled (Do Not Send Emails)' },
] as const

export const SMS_PROVIDER_OPTIONS = [
  { value: 'disabled', label: 'Disabled' },
  { value: 'msg91', label: 'MSG91 (India / International)' },
  { value: 'twilio', label: 'Twilio Cloud SMS' },
  { value: 'fast2sms', label: 'Fast2SMS' },
] as const

export const WHATSAPP_PROVIDER_OPTIONS = [
  { value: 'disabled', label: 'Disabled' },
  { value: 'interakt', label: 'Interakt (Jio Haptik)' },
  { value: 'gupshup', label: 'Gupshup Enterprise' },
  { value: 'wati', label: 'WATI WhatsApp API' },
] as const
