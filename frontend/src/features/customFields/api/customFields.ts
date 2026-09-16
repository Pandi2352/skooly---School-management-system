import { customFieldListSchema, customFieldSchema } from '../schemas/customField.schema'
import type { CustomField, CustomFieldInput } from '../types/customField.types'
import {
  createSampleCustomField,
  deleteSampleCustomField,
  moveSampleCustomField,
  readSampleCustomFields,
  updateSampleCustomField,
} from './sample/sampleCustomFields'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** TODO(api): `api.get('/custom-fields?form=admission', customFieldListSchema)`. */
export async function getCustomFields(): Promise<CustomField[]> {
  await Promise.resolve()
  return customFieldListSchema.parse(readSampleCustomFields())
}

/** TODO(api): `api.post('/custom-fields', customFieldSchema, input)`. */
export async function createCustomField(input: CustomFieldInput): Promise<CustomField> {
  await wait(300)
  return customFieldSchema.parse(createSampleCustomField(input, new Date()))
}

/** TODO(api): `api.put(`/custom-fields/${id}`, customFieldSchema, input)`. */
export async function updateCustomField({
  id,
  input,
}: {
  id: string
  input: CustomFieldInput
}): Promise<CustomField> {
  await wait(300)
  return customFieldSchema.parse(updateSampleCustomField(id, input))
}

/** TODO(api): `api.delete(`/custom-fields/${id}`)`. */
export async function deleteCustomField(id: string): Promise<void> {
  await wait(200)
  deleteSampleCustomField(id)
}

/** TODO(api): `api.post(`/custom-fields/${id}/move`, { direction })`. */
export async function moveCustomField({
  id,
  direction,
}: {
  id: string
  direction: 'up' | 'down'
}): Promise<void> {
  await Promise.resolve()
  moveSampleCustomField(id, direction)
}
