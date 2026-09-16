import type { CustomField, CustomFieldInput } from '../../types/customField.types'
import { moveItem, uniqueFieldKey } from '../../utils/customFields'

// SAMPLE DATA: two example fields until the custom fields API exists (antislop R-38). Changes only
// update this in-memory list, which resets on reload; success messages say so.

let fields: CustomField[] = [
  {
    id: 'sample-field-1',
    key: 'birth_marks',
    label: 'Birth Marks',
    type: 'text',
    options: [],
    placeholder: 'e.g. Mole on the left hand',
    helpText: 'Used to identify the student.',
    required: false,
    active: true,
  },
  {
    id: 'sample-field-2',
    key: 'previous_board',
    label: 'Previous School Board',
    type: 'select',
    options: ['CBSE', 'ICSE', 'State Board', 'Other'],
    placeholder: 'Select board',
    helpText: '',
    required: false,
    active: true,
  },
]

export const readSampleCustomFields = () => fields

export function createSampleCustomField(input: CustomFieldInput, now: Date): CustomField {
  const field: CustomField = {
    ...input,
    id: `sample-field-${String(now.getTime())}`,
    key: uniqueFieldKey(
      input.label,
      fields.map((item) => item.key),
    ),
  }
  fields = [...fields, field]
  return field
}

export function updateSampleCustomField(id: string, input: CustomFieldInput): CustomField {
  const existing = fields.find((item) => item.id === id)
  if (!existing) throw new Error('This field doesn’t exist any more. Reload the page.')
  const updated: CustomField = { ...existing, ...input }
  fields = fields.map((item) => (item.id === id ? updated : item))
  return updated
}

export function deleteSampleCustomField(id: string) {
  fields = fields.filter((item) => item.id !== id)
}

export function moveSampleCustomField(id: string, direction: 'up' | 'down') {
  fields = moveItem(fields, id, direction)
}
