export const ADMISSION_STEPS = [
  'academic',
  'personal',
  'parents',
  'health',
  'bank',
  'fees',
  'documents',
] as const

export const ADMISSION_STEP_LABELS: Record<(typeof ADMISSION_STEPS)[number], string> = {
  academic: 'Academic',
  personal: 'Personal Info',
  parents: 'Parents',
  health: 'Health',
  bank: 'Bank',
  fees: 'Fees',
  documents: 'Documents',
}

export const GENDERS = ['male', 'female', 'other'] as const

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

export const BLOOD_GROUP_OPTIONS = BLOOD_GROUPS.map((group) => ({ value: group, label: group }))

export const SOCIAL_CATEGORIES = ['general', 'obc', 'sc', 'st', 'ews', 'other'] as const

export const SOCIAL_CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
  { value: 'other', label: 'Other' },
]

export const RELIGIONS = [
  'hindu',
  'muslim',
  'christian',
  'sikh',
  'buddhist',
  'jain',
  'parsi',
  'jewish',
  'other',
  'not-stated',
] as const

export const RELIGION_OPTIONS = [
  { value: 'hindu', label: 'Hindu' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'christian', label: 'Christian' },
  { value: 'sikh', label: 'Sikh' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'jain', label: 'Jain' },
  { value: 'parsi', label: 'Parsi' },
  { value: 'jewish', label: 'Jewish' },
  { value: 'other', label: 'Other' },
  { value: 'not-stated', label: 'Prefer not to say' },
]

export const PARENT_ACCOUNT_MODES = ['new', 'existing'] as const

export const PARENT_ACCOUNT_OPTIONS = [
  { value: 'new', label: 'Create New Parent Account' },
  { value: 'existing', label: 'Link to Existing Parent Account' },
]

/** Who the school contacts first. Their name and phone number are required. */
export const GUARDIAN_TYPES = ['father', 'mother', 'other'] as const

export const GUARDIAN_OPTIONS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'other', label: 'Other' },
]

export const ACCEPTED_DOCUMENT_TYPES: string[] = ['application/pdf', 'image/jpeg', 'image/png']
export const DOCUMENT_MAX_BYTES = 5 * 1024 * 1024
export const PHOTO_MAX_BYTES = 1024 * 1024
