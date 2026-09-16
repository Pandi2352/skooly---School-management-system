import { slugify } from '@/lib/slugify'
import { CUSTOM_FIELD_TYPES, CUSTOM_VALUE_MAX_LENGTH } from '../constants'
import type {
  CustomField,
  CustomFieldFormValues,
  CustomFieldInput,
  CustomFieldType,
  CustomValues,
} from '../types/customField.types'

export const isCustomFieldType = (value: string): value is CustomFieldType =>
  CUSTOM_FIELD_TYPES.some((type) => type === value)

/** One option per line: trimmed, blanks and repeats dropped. */
export const parseOptions = (text: string) => [
  ...new Set(
    text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== ''),
  ),
]

/** "Birth Marks" → "birth_marks"; adds _2, _3… if the key is taken. */
export function uniqueFieldKey(label: string, takenKeys: string[]) {
  const base = slugify(label).replace(/-/g, '_') || 'field'
  let key = base
  for (let suffix = 2; takenKeys.includes(key); suffix += 1) key = `${base}_${String(suffix)}`
  return key
}

export function moveItem<T extends { id: string }>(
  items: T[],
  id: string,
  direction: 'up' | 'down',
) {
  const index = items.findIndex((item) => item.id === id)
  const target = direction === 'up' ? index - 1 : index + 1
  const item = items[index]
  if (!item || target < 0 || target >= items.length) return items
  const next = [...items]
  next.splice(index, 1)
  next.splice(target, 0, item)
  return next
}

export const toFormValues = (field: CustomField | null): CustomFieldFormValues =>
  field
    ? {
        label: field.label,
        type: field.type,
        optionsText: field.options.join('\n'),
        placeholder: field.placeholder,
        helpText: field.helpText,
        required: field.required,
        active: field.active,
      }
    : {
        label: '',
        type: 'text',
        optionsText: '',
        placeholder: '',
        helpText: '',
        required: false,
        active: true,
      }

/** Drops settings that don't apply to the chosen type, such as options on a text field. */
export const toFieldInput = (values: CustomFieldFormValues): CustomFieldInput => ({
  label: values.label.trim(),
  type: values.type,
  options: values.type === 'select' ? parseOptions(values.optionsText) : [],
  placeholder: values.type === 'checkbox' ? '' : values.placeholder.trim(),
  helpText: values.helpText.trim(),
  required: values.required,
  active: values.active,
})

type AnswerMap = Partial<Record<string, string | boolean>>

/** Messages for answers that break a field's rules, keyed by field key. Empty when all is well. */
export function validateCustomValues(fields: CustomField[], values: AnswerMap) {
  const problems: Record<string, string> = {}
  for (const field of fields) {
    if (!field.active) continue
    const value = values[field.key]

    if (field.type === 'checkbox') {
      if (field.required && value !== true)
        problems[field.key] = `Tick “${field.label}” to continue`
      continue
    }

    const text = typeof value === 'string' ? value.trim() : ''
    if (text === '') {
      if (field.required) {
        problems[field.key] =
          field.type === 'select' ? `Choose ${field.label}` : `Enter ${field.label}`
      }
      continue
    }
    if (text.length > CUSTOM_VALUE_MAX_LENGTH) {
      problems[field.key] = `Use ${String(CUSTOM_VALUE_MAX_LENGTH)} characters or fewer`
    } else if (field.type === 'number' && !/^-?\d+(\.\d+)?$/.test(text)) {
      problems[field.key] = 'Enter a number, like 42'
    } else if (field.type === 'date' && Number.isNaN(Date.parse(text))) {
      problems[field.key] = 'Enter a valid date'
    } else if (field.type === 'select' && !field.options.includes(text)) {
      problems[field.key] = `Choose one of the options for ${field.label}`
    }
  }
  return problems
}

/** Answers to send: active fields only, text trimmed, tick boxes as true or false. */
export function pickCustomValues(fields: CustomField[], values: AnswerMap): CustomValues {
  const picked: CustomValues = {}
  for (const field of fields) {
    if (!field.active) continue
    const value = values[field.key]
    picked[field.key] =
      field.type === 'checkbox' ? value === true : typeof value === 'string' ? value.trim() : ''
  }
  return picked
}
