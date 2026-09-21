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
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  gradeApplied: z.number(),
  bloodGroup: z.string().optional().default(''),
  previousSchool: z.string().optional().default(''),
  photoUrl: z.string().optional(),
  category: z.string().optional(),
  house: z.string().optional(),
  religion: z.string().optional(),
  nationalId: z.string().optional(),
  penId: z.string().optional(),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  motherTongue: z.string().optional(),
  placeOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  belowPovertyLine: z.boolean().optional(),
  rightToEducation: z.boolean().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
})

export const applicantParentSchema = z.object({
  guardianType: z.enum(['father', 'mother', 'guardian']),
  name: z.string().min(1, 'Parent name is required'),
  email: z.string(),
  phone: z.string().min(6, 'Valid phone number is required'),
  occupation: z.string().optional().default(''),
  address: z.string().optional().default(''),
  fatherName: z.string().optional(),
  fatherPhone: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherQualification: z.string().optional(),
  fatherAadhaar: z.string().optional(),
  fatherIncomePaise: z.number().nullable().optional(),
  motherName: z.string().optional(),
  motherPhone: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherQualification: z.string().optional(),
  motherAadhaar: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  permanentAddress: z.string().optional(),
})

export const applicantAcademicSchema = z.object({
  admissionNo: z.string().optional(),
  rollNo: z.string().optional(),
  admissionDate: z.string().optional(),
  section: z.string().optional(),
  biometricId: z.string().optional(),
  openingDuePaise: z.number().optional(),
})

export const applicantHealthSchema = z.object({
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  heightCm: z.string().optional(),
  weightKg: z.string().optional(),
})

export const applicantBankSchema = z.object({
  accountHolder: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifsc: z.string().optional(),
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
  academic: applicantAcademicSchema.optional(),
  health: applicantHealthSchema.optional(),
  bank: applicantBankSchema.optional(),
  feeGroupIds: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
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

export const admissionGradeCountSchema = z.object({ grade: z.number(), count: z.number() })
export const admissionDayCountSchema = z.object({ day: z.string(), count: z.number() })

export const admissionStatsSchema = z.object({
  total: z.number(),
  underReview: z.number(),
  approved: z.number(),
  enrolled: z.number(),
  rejected: z.number(),
  byGrade: z.array(admissionGradeCountSchema),
  /** One entry per day including quiet ones, so the trend line can't invent a busy week. */
  byDay: z.array(admissionDayCountSchema),
  windowDays: z.number(),
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
export type ApplicantAcademic = z.infer<typeof applicantAcademicSchema>
export type ApplicantHealth = z.infer<typeof applicantHealthSchema>
export type ApplicantBank = z.infer<typeof applicantBankSchema>
export type AdmissionApplicationStatus = z.infer<typeof admissionApplicationStatusSchema>
export type AdmissionApplication = z.infer<typeof admissionApplicationSchema>
export type AdmissionApplicationList = z.infer<typeof admissionApplicationListSchema>
export type AdmissionStats = z.infer<typeof admissionStatsSchema>
export type UpdateAdmissionStatusInput = z.infer<typeof updateAdmissionStatusSchema>
export type EnrollApplicantInput = z.infer<typeof enrollApplicantSchema>
export type EnrollApplicantResult = z.infer<typeof enrollApplicantResultSchema>

/** What the API answers with after a deletion: enough to name what went. */
export const deletedApplicationSchema = z.object({ id: z.string(), applicationNo: z.string() })

export type AdmissionGradeCount = z.infer<typeof admissionGradeCountSchema>
export type AdmissionDayCount = z.infer<typeof admissionDayCountSchema>
