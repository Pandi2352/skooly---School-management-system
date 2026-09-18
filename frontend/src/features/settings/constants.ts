export const SETTINGS_TABS = [
  'profile',
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
