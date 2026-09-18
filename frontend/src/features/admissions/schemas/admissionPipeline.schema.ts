import { z } from 'zod'

export const admissionDocumentStatusSchema = z.enum([
  'submitted',
  'pending',
  'verified',
  'rejected',
])

export const admissionDocumentSchema = z.object({
  name: z.string(),
  status: admissionDocumentStatusSchema,
  url: z.string().optional(),
  fileUrl: z.string().optional(),
  verifiedAt: z.string().nullable().optional(),
})

export const applicantStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  gradeApplied: z.number(),
  bloodGroup: z.string().optional().default(''),
  previousSchool: z.string().optional().default(''),
})

export const applicantParentSchema = z.object({
  guardianType: z.enum(['father', 'mother', 'guardian']),
  name: z.string().min(1, 'Parent name is required'),
  email: z.string(),
  phone: z.string().min(6, 'Valid phone number is required'),
  occupation: z.string().optional().default(''),
  address: z.string().optional().default(''),
})

export const admissionApplicationStatusSchema = z.enum([
  'draft',
  'submitted',
  'under-review',
  'approved',
  'rejected',
  'enrolled',
])

export const admissionApplicationSchema = z.object({
  _id: z.string(),
  applicationNo: z.string(),
  student: applicantStudentSchema,
  parent: applicantParentSchema,
  documents: z.array(admissionDocumentSchema).default([]),
  status: admissionApplicationStatusSchema,
  appliedAt: z.string(),
  reviewedAt: z.string().nullable().optional(),
  reviewerNotes: z.string().nullable().optional().default(''),
  enrolledStudentId: z.string().nullable().optional(),
  enrolledAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const admissionApplicationListSchema = z.object({
  items: z.array(admissionApplicationSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export const admissionStatsSchema = z.object({
  total: z.number(),
  underReview: z.number(),
  approved: z.number(),
  enrolled: z.number(),
  rejected: z.number(),
})

export const updateAdmissionStatusSchema = z.object({
  status: z.enum(['under-review', 'approved', 'rejected']),
  reviewerNotes: z.string().optional(),
})

export const enrollApplicantSchema = z.object({
  section: z.string().min(1, 'Section is required'),
  feeGroupId: z.string().optional(),
})

export const enrollApplicantResultSchema = z.object({
  success: z.boolean(),
  studentId: z.string(),
  admissionNo: z.string(),
  rollNo: z.string(),
  message: z.string(),
})

export type AdmissionDocumentStatus = z.infer<typeof admissionDocumentStatusSchema>
export type AdmissionDocument = z.infer<typeof admissionDocumentSchema>
export type ApplicantStudent = z.infer<typeof applicantStudentSchema>
export type ApplicantParent = z.infer<typeof applicantParentSchema>
export type AdmissionApplicationStatus = z.infer<typeof admissionApplicationStatusSchema>
export type AdmissionApplication = z.infer<typeof admissionApplicationSchema>
export type AdmissionApplicationList = z.infer<typeof admissionApplicationListSchema>
export type AdmissionStats = z.infer<typeof admissionStatsSchema>
export type UpdateAdmissionStatusInput = z.infer<typeof updateAdmissionStatusSchema>
export type EnrollApplicantInput = z.infer<typeof enrollApplicantSchema>
export type EnrollApplicantResult = z.infer<typeof enrollApplicantResultSchema>
