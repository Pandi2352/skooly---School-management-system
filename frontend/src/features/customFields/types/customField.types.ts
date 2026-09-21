import type { z } from 'zod'
import type { CUSTOM_FIELD_TYPES } from '../constants'
import type {
  customFieldFormSchema,
  customFieldInputSchema,
  customFieldListMetaSchema,
  customFieldSchema,
} from '../schemas/customField.schema'

export type CustomField = z.infer<typeof customFieldSchema>
export type CustomFieldInput = z.infer<typeof customFieldInputSchema>
export type CustomFieldFormValues = z.infer<typeof customFieldFormSchema>
export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number]
export type CustomFieldListMeta = z.infer<typeof customFieldListMetaSchema>
export type CustomFieldListResult = { fields: CustomField[]; meta: CustomFieldListMeta }

/** Answers on a form, keyed by field key. Tick boxes are booleans; everything else is text. */
export type CustomValues = Record<string, string | boolean>
