import { api } from '@/lib/api/client'
import {
  admissionApplicationListSchema,
  admissionApplicationSchema,
  admissionStatsSchema,
  enrollApplicantResultSchema,
  type AdmissionApplication,
  type AdmissionApplicationList,
  type AdmissionStats,
  type EnrollApplicantInput,
  type EnrollApplicantResult,
  type UpdateAdmissionStatusInput,
  deletedApplicationSchema,
} from '../schemas/admissionPipeline.schema'
import {
  deleteSampleApplication,
  enrollSampleApplicant,
  readSampleApplications,
  readSampleStats,
  updateSampleApplicationDetails,
  updateSampleApplicationStatus,
} from './sample/samplePipeline'

const isTestMode = import.meta.env.MODE === 'test'

export type AdmissionPipelineFilters = {
  status?: string
  search?: string
  grade?: number
  /** Whether every document an applicant sent has been checked. */
  documents?: 'all' | 'verified' | 'pending'
  appliedFrom?: string
  appliedTo?: string
  sort?: 'newest' | 'oldest' | 'name' | 'grade'
  page?: number
  limit?: number
}

export async function getAdmissionApplications(
  filters?: AdmissionPipelineFilters,
): Promise<AdmissionApplicationList> {
  if (isTestMode) {
    return admissionApplicationListSchema.parse(readSampleApplications(filters))
  }

  const searchParams = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') {
    searchParams.set('status', filters.status)
  }
  if (filters?.search) {
    searchParams.set('search', filters.search)
  }
  if (filters?.grade) {
    searchParams.set('grade', String(filters.grade))
  }
  if (filters?.page) {
    searchParams.set('page', String(filters.page))
  }
  if (filters?.limit) {
    searchParams.set('limit', String(filters.limit))
  }
  if (filters?.documents && filters.documents !== 'all') {
    searchParams.set('documents', filters.documents)
  }
  if (filters?.appliedFrom) {
    searchParams.set('appliedFrom', filters.appliedFrom)
  }
  if (filters?.appliedTo) {
    searchParams.set('appliedTo', filters.appliedTo)
  }
  if (filters?.sort && filters.sort !== 'newest') {
    searchParams.set('sort', filters.sort)
  }

  const query = searchParams.toString()
  const path = query ? `/admissions?${query}` : '/admissions'
  return api.get(path, admissionApplicationListSchema)
}

export async function getAdmissionStats(): Promise<AdmissionStats> {
  if (isTestMode) {
    return admissionStatsSchema.parse(readSampleStats())
  }
  return api.get('/admissions/stats', admissionStatsSchema)
}

export async function updateAdmissionStatus(
  id: string,
  input: UpdateAdmissionStatusInput,
): Promise<AdmissionApplication> {
  if (isTestMode) {
    return admissionApplicationSchema.parse(
      updateSampleApplicationStatus(id, input.status, input.reviewerNotes),
    )
  }
  return api.patch(`/admissions/${id}/status`, admissionApplicationSchema, input)
}

/** Corrections to the applicant's own details: a misheard name, the wrong grade, a new number. */
export type UpdateAdmissionDetailsInput = {
  firstName?: string
  lastName?: string
  gradeApplied?: number
  previousSchool?: string
  parentName?: string
  parentPhone?: string
  parentEmail?: string
}

export async function updateAdmissionDetails(
  id: string,
  input: UpdateAdmissionDetailsInput,
): Promise<AdmissionApplication> {
  if (isTestMode) return admissionApplicationSchema.parse(updateSampleApplicationDetails(id, input))
  return api.patch(`/admissions/${id}`, admissionApplicationSchema, input)
}

export async function deleteAdmissionApplication(id: string): Promise<string> {
  if (isTestMode) return deleteSampleApplication(id)
  const { applicationNo } = await api.delete(`/admissions/${id}`, deletedApplicationSchema)
  return applicationNo
}

export async function enrollApplicant(
  id: string,
  input: EnrollApplicantInput,
): Promise<EnrollApplicantResult> {
  if (isTestMode) {
    return enrollApplicantResultSchema.parse(enrollSampleApplicant(id, input.section))
  }
  return api.post(`/admissions/${id}/enroll`, enrollApplicantResultSchema, input)
}
