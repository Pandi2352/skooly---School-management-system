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
