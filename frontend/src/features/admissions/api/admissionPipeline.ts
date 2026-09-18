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
} from '../schemas/admissionPipeline.schema'
import {
  enrollSampleApplicant,
  readSampleApplications,
  readSampleStats,
  updateSampleApplicationStatus,
} from './sample/samplePipeline'

const isTestMode = import.meta.env.MODE === 'test'

export type AdmissionPipelineFilters = {
  status?: string
  search?: string
  grade?: number
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

export async function enrollApplicant(
  id: string,
  input: EnrollApplicantInput,
): Promise<EnrollApplicantResult> {
  if (isTestMode) {
    return enrollApplicantResultSchema.parse(enrollSampleApplicant(id, input.section))
  }
  return api.post(`/admissions/${id}/enroll`, enrollApplicantResultSchema, input)
}
