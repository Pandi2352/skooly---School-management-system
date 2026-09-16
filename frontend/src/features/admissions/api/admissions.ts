import {
  admissionResultSchema,
  feeGroupListSchema,
  houseOptionsSchema,
  nextNumbersSchema,
  parentAccountListSchema,
} from '../schemas/admission.schema'
import type {
  AdmissionRequest,
  AdmissionResult,
  FeeGroup,
  NextNumbers,
  ParentAccount,
} from '../types/admission.types'
import {
  readSampleNextNumbers,
  sampleFeeGroups,
  sampleHouses,
  sampleParentAccounts,
  saveSampleAdmission,
} from './sample/sampleAdmissions'

/** TODO(api): `api.get('/fee-groups?session=current', feeGroupListSchema)`. */
export async function getFeeGroups(): Promise<FeeGroup[]> {
  await Promise.resolve()
  return feeGroupListSchema.parse(sampleFeeGroups)
}

/**
 * TODO(api): search on the server instead, `api.get('/parents?search=', parentAccountListSchema)`,
 * once there are too many parents to load at once.
 */
export async function getParentAccounts(): Promise<ParentAccount[]> {
  await Promise.resolve()
  return parentAccountListSchema.parse(sampleParentAccounts)
}

/** TODO(api): `api.get('/houses', houseOptionsSchema)`, from the Student Houses setup. */
export async function getHouseOptions(): Promise<{ value: string; label: string }[]> {
  await Promise.resolve()
  return houseOptionsSchema.parse(sampleHouses)
}

/** TODO(api): `api.get('/admissions/next-numbers?grade=&section=', nextNumbersSchema)`. */
export async function getNextNumbers({
  grade,
  section,
}: {
  grade: number | null
  section: string
}): Promise<NextNumbers> {
  await Promise.resolve()
  return nextNumbersSchema.parse(readSampleNextNumbers(grade, section))
}

/**
 * TODO(api): send as multipart form data (the photo and documents as files) with
 * `api.post('/admissions', admissionResultSchema, body)`.
 */
export async function submitAdmission(request: AdmissionRequest): Promise<AdmissionResult> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return admissionResultSchema.parse(saveSampleAdmission(request, new Date()))
}
