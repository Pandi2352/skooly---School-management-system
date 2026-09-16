import type { z } from 'zod'
import type { DATE_FORMATS, SETTINGS_TABS, SESSION_FORMATS } from '../constants'
import type { schoolProfileSchema } from '../schemas/schoolProfile.schema'
import type {
  datedSequenceSchema,
  sequenceSchema,
  systemSettingsSchema,
} from '../schemas/systemSettings.schema'

export type SchoolProfile = z.infer<typeof schoolProfileSchema>
export type SettingsTab = (typeof SETTINGS_TABS)[number]

export type SystemSettings = z.infer<typeof systemSettingsSchema>
export type Sequence = z.infer<typeof sequenceSchema>
export type DatedSequence = z.infer<typeof datedSequenceSchema>
export type SessionFormat = (typeof SESSION_FORMATS)[number]
export type DateFormat = (typeof DATE_FORMATS)[number]
/** Form sections that hold a sequence. */
export type SequenceName = 'feeReceipt' | 'admission' | 'roll'
export type DatedSequenceName = 'feeReceipt' | 'admission'
