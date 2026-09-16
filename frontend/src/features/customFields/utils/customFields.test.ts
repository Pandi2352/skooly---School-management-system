import { describe, expect, it } from 'vitest'
import { customFieldFormSchema } from '../schemas/customField.schema'
import type { CustomField } from '../types/customField.types'
import {
  moveItem,
  parseOptions,
  pickCustomValues,
  toFieldInput,
  toFormValues,
  uniqueFieldKey,
  validateCustomValues,
} from './customFields'

const field = (overrides: Partial<CustomField>): CustomField => ({
  id: 'f1',
  key: 'birth_marks',
  label: 'Birth Marks',
  type: 'text',
  options: [],
  placeholder: '',
  helpText: '',
  required: false,
  active: true,
  ...overrides,
})

describe('custom field settings', () => {
  it('parses options and makes unique keys', () => {
    expect(parseOptions(' CBSE \n\nICSE\nCBSE')).toEqual(['CBSE', 'ICSE'])
    expect(uniqueFieldKey('Birth Marks', [])).toBe('birth_marks')
    expect(uniqueFieldKey('Birth Marks', ['birth_marks', 'birth_marks_2'])).toBe('birth_marks_3')
  })

  it('moves fields within bounds', () => {
    const items = [{ id: 'a' }, { id: 'b' }]
    expect(moveItem(items, 'b', 'up').map((item) => item.id)).toEqual(['b', 'a'])
    expect(moveItem(items, 'a', 'up')).toBe(items)
  })

  it('needs 2 options for a dropdown and drops options for other types', () => {
    const values = {
      ...toFormValues(null),
      label: 'Board',
      type: 'select' as const,
      optionsText: 'CBSE',
    }
    expect(customFieldFormSchema.safeParse(values).success).toBe(false)
    expect(toFieldInput({ ...values, type: 'text' }).options).toEqual([])
  })
})

describe('custom answers', () => {
  const fields = [
    field({ key: 'marks', label: 'Birth Marks', required: true }),
    field({ id: 'f2', key: 'board', label: 'Board', type: 'select', options: ['CBSE', 'ICSE'] }),
    field({ id: 'f3', key: 'age', label: 'Age', type: 'number' }),
    field({ id: 'f4', key: 'consent', label: 'Photo consent', type: 'checkbox', required: true }),
    field({ id: 'f5', key: 'hidden', label: 'Hidden', required: true, active: false }),
  ]

  it('reports broken rules and skips hidden fields', () => {
    expect(validateCustomValues(fields, { marks: ' ', board: 'Other', age: 'ten' })).toEqual({
      marks: 'Enter Birth Marks',
      board: 'Choose one of the options for Board',
      age: 'Enter a number, like 42',
      consent: 'Tick “Photo consent” to continue',
    })
    expect(validateCustomValues(fields, { marks: 'Mole', consent: true })).toEqual({})
  })

  it('sends active answers only', () => {
    expect(pickCustomValues(fields, { marks: ' Mole ', hidden: 'x' })).toEqual({
      marks: 'Mole',
      board: '',
      age: '',
      consent: false,
    })
  })
})
