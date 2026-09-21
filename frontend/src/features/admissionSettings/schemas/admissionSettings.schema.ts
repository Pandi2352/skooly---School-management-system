import { z } from 'zod'

/** The API sits outside this app's type system, so every response is parsed, never trusted. */
export const uploadedAssetSchema = z.object({
  url: z.string(),
  originalName: z.string(),
  sizeInBytes: z.number(),
  uploadedAt: z.string(),
})

export const admissionSettingsSchema = z.object({
  admissionsOpen: z.boolean(),
  sessionLabel: z.string(),
  publicSlug: z.string(),
  publicUrl: z.string(),
  /** False while the public application page is still to be built. */
  publicPageLive: z.boolean(),
  feeEnabled: z.boolean(),
  feeAmount: z.number(),
  feeNote: z.string(),
  paymentQr: uploadedAssetSchema.nullable(),
  updatedAt: z.string(),
})

/** The form. The slug is what families type or scan, so it is kept plain and lower case. */
export const admissionSettingsFormSchema = z.object({
  admissionsOpen: z.boolean(),
  sessionLabel: z.string().trim().max(20, 'Use 20 characters or fewer'),
  publicSlug: z
    .string()
    .trim()
    .toLowerCase()
    .refine(
      (value) => value === '' || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      'Use lower case letters, numbers and dashes only, like green-valley',
    )
    .refine((value) => value === '' || value.length >= 3, 'Use at least 3 characters'),
  feeEnabled: z.boolean(),
  feeAmount: z
    .string()
    .refine((value) => value === '' || /^\d+$/.test(value), 'Enter the fee as a whole number')
    .refine((value) => value === '' || Number(value) <= 100000, 'That fee looks far too high'),
  feeNote: z.string().trim().max(300, 'Use 300 characters or fewer'),
})
