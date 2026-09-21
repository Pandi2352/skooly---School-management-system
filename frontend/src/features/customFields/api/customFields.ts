import { api } from '@/lib/api/client'
import {
  customFieldListMetaSchema,
  customFieldListSchema,
  customFieldSchema,
  deletedCustomFieldSchema,
} from '../schemas/customField.schema'
import type { CustomField, CustomFieldInput, CustomFieldListResult } from '../types/customField.types'
import { readSampleCustomFields, sampleListResult } from './sample/sampleCustomFields'

/** Only the admission form has questions today; the API takes the form so others can follow. */
const FORM = 'admission'

/**
 * The settings view: every question including hidden ones, with counts. Needs the Custom Fields
 * permission, which is why the admission form uses `getActiveCustomFields` instead.
 */
export async function getCustomFields(): Promise<CustomFieldListResult> {
  if (import.meta.env.MODE === 'test') return sampleListResult()
  const { data, meta } = await api.getWithMeta(
    `/custom-fields?form=${FORM}`,
    customFieldListSchema,
    customFieldListMetaSchema,
  )
  return { fields: data, meta }
}

/** What the admission form asks: hidden questions left out, in order. Open to anyone signed in. */
export async function getActiveCustomFields(): Promise<CustomField[]> {
  if (import.meta.env.MODE === 'test') return readSampleCustomFields().filter((field) => field.active)
  return api.get(`/custom-fields/active?form=${FORM}`, customFieldListSchema)
}

export function createCustomField(input: CustomFieldInput): Promise<CustomField> {
  return api.post('/custom-fields', customFieldSchema, { ...input, form: FORM })
}

export function updateCustomField({ id, input }: { id: string; input: CustomFieldInput }): Promise<CustomField> {
  return api.patch(`/custom-fields/${id}`, customFieldSchema, input)
}

export async function deleteCustomField(id: string): Promise<string> {
  const { label } = await api.delete(`/custom-fields/${id}`, deletedCustomFieldSchema)
  return label
}

/** Moving returns the whole form in its new order, so the page never guesses at the result. */
export async function moveCustomField({
  id,
  direction,
}: {
  id: string
  direction: 'up' | 'down'
}): Promise<CustomFieldListResult> {
  const { data, meta } = await api.putWithMeta(
    `/custom-fields/${id}/move`,
    customFieldListSchema,
    customFieldListMetaSchema,
    { direction },
  )
  return { fields: data, meta }
}
