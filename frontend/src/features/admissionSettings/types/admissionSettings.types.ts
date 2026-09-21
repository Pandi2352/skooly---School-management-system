import type { z } from 'zod'
import type {
  admissionSettingsFormSchema,
  admissionSettingsSchema,
} from '../schemas/admissionSettings.schema'

export type AdmissionSettings = z.infer<typeof admissionSettingsSchema>
export type AdmissionSettingsFormValues = z.infer<typeof admissionSettingsFormSchema>
