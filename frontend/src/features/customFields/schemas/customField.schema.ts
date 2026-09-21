import { z } from 'zod'
import { CUSTOM_FIELD_TYPES } from '../constants'
import { parseOptions } from '../utils/customFields'

/** A school-defined question on the admission form. The list order is the order on the form. */
export const customFieldSchema = z.object({
  id: z.string(),
  form: z.string(),
  /** Stable name answers are saved under; set once from the first label and never changed. */
  key: z.string(),
  label: z.string(),
  type: z.enum(CUSTOM_FIELD_TYPES),
  /** Choices for a dropdown; empty for other types. */
  options: z.array(z.string()),
  placeholder: z.string(),
  helpText: z.string(),
  required: z.boolean(),
  /** Hidden fields stay in settings but aren't asked on the form. */
  active: z.boolean(),
  /** Where it sits on the form, counting from 0. */
  position: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const customFieldListSchema = z.array(customFieldSchema)

export const customFieldInputSchema = customFieldSchema.omit({
  id: true,
  form: true,
  key: true,
  position: true,
  createdAt: true,
  updatedAt: true,
})

export const customFieldListMetaSchema = z.object({
  total: z.number(),
  active: z.number(),
  required: z.number(),
  /** How many questions one form can carry, so the page can say when it is nearly full. */
  limit: z.number(),
})

export const deletedCustomFieldSchema = z.object({ id: z.string(), label: z.string() })

const tooLong = (max: number) => `Use ${max} characters or fewer`

/** The Add / Edit field dialog. Dropdown options are typed one per line. */
export const customFieldFormSchema = z
  .object({
    label: z.string().trim().min(1, 'Enter a label, like Birth Marks').max(60, tooLong(60)),
    type: z.enum(CUSTOM_FIELD_TYPES),
    optionsText: z.string(),
    placeholder: z.string().trim().max(80, tooLong(80)),
    helpText: z.string().trim().max(160, tooLong(160)),
    required: z.boolean(),
    active: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.type === 'select' && parseOptions(values.optionsText).length < 2) {
      ctx.addIssue({
        code: 'custom',
        path: ['optionsText'],
        message: 'Add at least 2 options, one per line',
      })
    }
  })
