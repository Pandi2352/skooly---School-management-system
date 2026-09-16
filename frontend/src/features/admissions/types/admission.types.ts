import type { z } from 'zod'
import type { ADMISSION_STEPS } from '../constants'
import type {
  admissionDocumentSchema,
  admissionFormSchema,
  admissionResultSchema,
  feeGroupSchema,
  nextNumbersSchema,
  parentAccountSchema,
} from '../schemas/admission.schema'

export type AdmissionStep = (typeof ADMISSION_STEPS)[number]
export type AdmissionFormValues = z.infer<typeof admissionFormSchema>
export type AdmissionDocument = z.infer<typeof admissionDocumentSchema>
export type AdmissionResult = z.infer<typeof admissionResultSchema>
export type NextNumbers = z.infer<typeof nextNumbersSchema>
export type ParentAccount = z.infer<typeof parentAccountSchema>
export type FeeGroup = z.infer<typeof feeGroupSchema>

type ParentsValues = AdmissionFormValues['parents']

/** Either a link to an existing parent account, or the details for a new one. */
export type ParentsRequest =
  | { mode: 'existing'; parentId: string }
  | (Omit<ParentsValues, 'sameAsGuardianAddress' | 'fatherIncome'> & {
      mode: 'new'
      fatherIncomePaise: number | null
    })

/** The request body sent to the API: numbers as numbers, money in paise, files as metadata. */
export type AdmissionRequest = {
  academic: Omit<AdmissionFormValues['academic'], 'classGrade' | 'openingDue'> & {
    grade: number
    openingDuePaise: number
  }
  student: Omit<AdmissionFormValues['personal'], 'firstName' | 'middleName' | 'lastName'> & {
    name: string
  }
  parents: ParentsRequest
  health: AdmissionFormValues['health']
  bank: AdmissionFormValues['bank']
  feeGroupIds: string[]
  /** Answers to the school's custom fields, keyed by field key. */
  customFields: Record<string, string | boolean>
  documents: { name: string; fileName: string; sizeBytes: number }[]
}
