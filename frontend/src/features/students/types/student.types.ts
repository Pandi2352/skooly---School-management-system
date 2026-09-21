import type { z } from 'zod'
import type {
  SIBLING_FILTERS,
  SORT_DIRECTIONS,
  STUDENT_SORT_FIELDS,
  STUDENT_VIEWS,
} from '../constants'
import type {
  classOptionSchema,
  enrollmentStatusSchema,
  feeStatusSchema,
  studentPageSchema,
  studentSchema,
  studentSummarySchema,
} from '../schemas/student.schema'
import type {
  attendanceRecordSchema,
  attendanceSummarySchema,
  documentTypeSchema,
  guardianDetailSchema,
  siblingSchema,
  studentBankSchema,
  studentDetailSchema,
  studentDocumentSchema,
  studentInvoiceSchema,
  studentParentProfileSchema,
} from '../schemas/studentDetail.schema'

// Data from the API: types derived from the schemas, so they can't drift apart.
export type EnrollmentStatus = z.infer<typeof enrollmentStatusSchema>
export type FeeStatus = z.infer<typeof feeStatusSchema>
export type Student = z.infer<typeof studentSchema>
export type StudentPage = z.infer<typeof studentPageSchema>
export type ClassOption = z.infer<typeof classOptionSchema>
export type StudentSummary = z.infer<typeof studentSummarySchema>

export type StudentDetail = z.infer<typeof studentDetailSchema>
export type StudentBank = z.infer<typeof studentBankSchema>
export type StudentParentProfile = z.infer<typeof studentParentProfileSchema>
export type GuardianDetail = z.infer<typeof guardianDetailSchema>
export type Sibling = z.infer<typeof siblingSchema>
export type StudentInvoice = z.infer<typeof studentInvoiceSchema>
export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>
export type AttendanceSummary = z.infer<typeof attendanceSummarySchema>
export type StudentDocument = z.infer<typeof studentDocumentSchema>
export type DocumentType = z.infer<typeof documentTypeSchema>

// Client-side only.
export type StatusFilter = EnrollmentStatus | 'all'
export type SiblingFilter = (typeof SIBLING_FILTERS)[number]
export type StudentSortField = (typeof STUDENT_SORT_FIELDS)[number]
export type SortDirection = (typeof SORT_DIRECTIONS)[number]
export type StudentSort = `${StudentSortField}-${SortDirection}`
export type StudentView = (typeof STUDENT_VIEWS)[number]

export type StudentFilters = {
  status: StatusFilter
  /** `null` means every class. */
  classGrade: number | null
  /** `null` means every section; only set together with a class. */
  section: string | null
  siblings: SiblingFilter
  search: string
  sort: StudentSort
  page: number
  pageSize: number
}
