import { z } from 'zod'
import {
  CURRENCIES,
  DATE_FORMATS,
  PREFIX_MAX_LENGTH,
  RECEIPT_TEMPLATES,
  SEQUENCE_PADDINGS,
  SEQUENCE_SEPARATORS,
  SESSION_FORMATS,
} from '../constants'

const prefix = z
  .string()
  .trim()
  .max(PREFIX_MAX_LENGTH, `Use ${PREFIX_MAX_LENGTH} characters or fewer`)
  .regex(/^[A-Za-z0-9/_-]*$/, 'Use letters, numbers, - / or _ only')

/** How a running number is built: prefix, session and a zero-padded counter. */
export const sequenceSchema = z.object({
  prefix,
  separator: z.enum(SEQUENCE_SEPARATORS),
  padding: z.enum(SEQUENCE_PADDINGS),
  includeSession: z.boolean(),
  sessionFormat: z.enum(SESSION_FORMATS),
})

/** A sequence that can also carry a date and has its own counter (receipts, admissions). */
export const datedSequenceSchema = sequenceSchema.extend({
  includeDate: z.boolean(),
  dateFormat: z.enum(DATE_FORMATS),
  nextNumber: z
    .number('Enter a number')
    .int('Use a whole number')
    .min(1, 'Use 1 or higher')
    .max(999_999, 'Use 999999 or lower'),
})

export const systemSettingsSchema = z.object({
  schoolCode: z.string().trim().max(20, 'Use 20 characters or fewer'),
  affiliatedBy: z.string().trim().max(60, 'Use 60 characters or fewer'),
  currency: z.enum(CURRENCIES, 'Choose a currency'),
  receiptTemplate: z.enum(RECEIPT_TEMPLATES),
  feeReceipt: datedSequenceSchema,
  admission: datedSequenceSchema,
  roll: sequenceSchema,
})
