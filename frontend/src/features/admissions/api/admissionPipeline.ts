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
  const list = await api.get(path, admissionApplicationListSchema)
  return {
    ...list,
    items: list.items.map((app) => ({
      ...app,
      student: {
        ...app.student,
        photoUrl:
          app.student.photoUrl ??
          (app.student.gender === 'female'
            ? '/mock/student_photo_girl.jpg'
            : '/mock/student_photo_boy.jpg'),
      },
    })),
  }
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

/** Corrections to the applicant's own details across all 7 steps. */
export type UpdateAdmissionDetailsInput = {
  // Student basic & personal
  firstName?: string
  middleName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  gradeApplied?: number
  bloodGroup?: string
  previousSchool?: string
  category?: string
  house?: string
  religion?: string
  nationalId?: string
  penId?: string
  caste?: string
  subCaste?: string
  motherTongue?: string
  placeOfBirth?: string
  nationality?: string
  belowPovertyLine?: boolean
  rightToEducation?: boolean
  phone?: string
  email?: string
  // Academic
  admissionNo?: string
  rollNo?: string
  admissionDate?: string
  biometricId?: string
  // Parents
  parentName?: string
  parentPhone?: string
  parentEmail?: string
  parentOccupation?: string
  parentAddress?: string
  guardianType?: 'father' | 'mother' | 'guardian'
  fatherName?: string
  fatherPhone?: string
  fatherOccupation?: string
  fatherQualification?: string
  fatherAadhaar?: string
  fatherIncomePaise?: number | null
  motherName?: string
  motherPhone?: string
  motherOccupation?: string
  motherQualification?: string
  motherAadhaar?: string
  emergencyName?: string
  emergencyPhone?: string
  permanentAddress?: string
  // Health
  heightCm?: string
  weightKg?: string
  medicalConditions?: string
  allergies?: string
  // Bank
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  accountHolderName?: string
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
