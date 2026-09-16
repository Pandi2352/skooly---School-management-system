import { z } from 'zod'
import { ENROLLMENT_STATUSES, FEE_STATUSES } from '../constants'

// The shape the student API must return. Responses are parsed in api/getStudents.ts, so a changed
// or broken response fails loudly instead of rendering wrong data. Types come from these schemas.

export const enrollmentStatusSchema = z.enum(ENROLLMENT_STATUSES)
export const feeStatusSchema = z.enum(FEE_STATUSES)

const countSchema = z.number().int().nonnegative()
const paiseSchema = z.number().int().nonnegative()

export const studentSchema = z.object({
  id: z.string(),
  admissionNo: z.string(),
  rollNo: z.string(),
  name: z.string(),
  grade: z.number().int().min(1),
  section: z.string(),
  /** Null until a photo is uploaded; the UI shows initials instead. */
  photoUrl: z.string().nullable(),
  guardianName: z.string(),
  guardianPhone: z.string(),
  fatherName: z.string(),
  fatherPhone: z.string(),
  siblingCount: countSchema,
  /** Money in integer paise (BLUEPRINT.md section 21). */
  totalAssignedPaise: paiseSchema,
  totalDuePaise: paiseSchema,
  enrollmentStatus: enrollmentStatusSchema,
  feeStatus: feeStatusSchema,
})

export const studentPageSchema = z.object({
  rows: z.array(studentSchema),
  /** Rows matching every filter. */
  total: countSchema,
  page: z.number().int().min(1),
  pageCount: z.number().int().min(1),
  /** Matches per enrollment status, with every other filter applied. */
  counts: z.object({
    all: countSchema,
    enrolled: countSchema,
    pending: countSchema,
    left: countSchema,
  }),
})

/** School-wide counts for the page header; not affected by list filters. */
export const studentSummarySchema = z.object({
  /** Students on the rolls this academic session (studying or admission pending). */
  sessionTotal: countSchema,
  /** Every student ever admitted, including those who left. */
  allTime: countSchema,
  /** Session students not yet placed in a class and section. */
  unassigned: countSchema,
})

export const classOptionSchema = z.object({
  grade: z.number().int().min(1),
  label: z.string(),
  sections: z.array(z.string()),
})

export const classOptionsSchema = z.array(classOptionSchema)
