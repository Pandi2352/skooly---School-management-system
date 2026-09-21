import type { CustomField, CustomFieldListResult } from '../../types/customField.types'

/**
 * Stand-in questions for unit tests only, never shown to a school: the app reads the real API in
 * every other mode. They are the two an Indian school most often adds, so the tests read like the
 * real thing.
 */
const SAMPLE_FIELDS: CustomField[] = [
  {
    id: 'sample-field-1',
    form: 'admission',
    key: 'birth_marks',
    label: 'Birth marks',
    type: 'text',
    options: [],
    placeholder: 'e.g. mole on the left hand',
    helpText: 'Used to identify the student.',
    required: false,
    active: true,
    position: 0,
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'sample-field-2',
    form: 'admission',
    key: 'previous_board',
    label: 'Previous school board',
    type: 'select',
    options: ['CBSE', 'ICSE', 'State Board', 'Other'],
    placeholder: 'Choose a board',
    helpText: '',
    required: true,
    active: true,
    position: 1,
    createdAt: '2026-09-01T09:05:00.000Z',
    updatedAt: '2026-09-01T09:05:00.000Z',
  },
  {
    id: 'sample-field-3',
    form: 'admission',
    key: 'hostel_required',
    label: 'Hostel required',
    type: 'checkbox',
    options: [],
    placeholder: '',
    helpText: 'Tick if the family wants a hostel place.',
    required: false,
    active: false,
    position: 2,
    createdAt: '2026-09-01T09:10:00.000Z',
    updatedAt: '2026-09-01T09:10:00.000Z',
  },
]

export const readSampleCustomFields = (): CustomField[] => SAMPLE_FIELDS

export function sampleListResult(): CustomFieldListResult {
  const active = SAMPLE_FIELDS.filter((field) => field.active)
  return {
    fields: SAMPLE_FIELDS,
    meta: {
      total: SAMPLE_FIELDS.length,
      active: active.length,
      required: active.filter((field) => field.required).length,
      limit: 60,
    },
  }
}
