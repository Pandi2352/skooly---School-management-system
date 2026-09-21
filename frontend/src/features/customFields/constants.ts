export const CUSTOM_FIELD_TYPES = [
  'text',
  'textarea',
  'number',
  'date',
  'select',
  'checkbox',
] as const

export const CUSTOM_FIELD_TYPE_LABELS: Record<(typeof CUSTOM_FIELD_TYPES)[number], string> = {
  text: 'Short text',
  textarea: 'Long text',
  number: 'Number',
  date: 'Date',
  select: 'Dropdown',
  checkbox: 'Tick box',
}

export const CUSTOM_FIELD_TYPE_OPTIONS = CUSTOM_FIELD_TYPES.map((type) => ({
  value: type,
  label: CUSTOM_FIELD_TYPE_LABELS[type],
}))

export const CUSTOM_VALUE_MAX_LENGTH = 500

/**
 * Permission keys for this page, matching what the Roles & Permissions page shows for
 * Admissions → Admission Form Fields. Filling in an admission needs none of them.
 */
export const CUSTOM_FIELD_PERMISSIONS = {
  view: 'admissions.admission-form-fields:view',
  create: 'admissions.admission-form-fields:create',
  edit: 'admissions.admission-form-fields:edit',
  delete: 'admissions.admission-form-fields:delete',
} as const
