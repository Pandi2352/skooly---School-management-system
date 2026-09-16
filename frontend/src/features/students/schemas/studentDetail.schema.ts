import { z } from 'zod'
import { feeStatusSchema, studentSchema } from './student.schema'

export const genderSchema = z.enum(['male', 'female', 'other'])

export const guardianDetailSchema = z.object({
  name: z.string().min(1),
  relation: z.string().min(1),
  phone: z.string().min(1),
  email: z.email().optional().or(z.literal('')),
  occupation: z.string().optional(),
  address: z.string().optional(),
})

export const siblingSchema = z.object({
  id: z.string(),
  name: z.string(),
  grade: z.number().int().min(1),
  section: z.string(),
  relationship: z.string(),
})

export const emergencyContactSchema = z.object({
  name: z.string(),
  relation: z.string(),
  phone: z.string(),
})

export const medicalProfileSchema = z.object({
  bloodGroup: z.string(),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  emergencyContact: emergencyContactSchema,
  doctorNotes: z.string().optional(),
})

export const invoiceStatusSchema = z.enum(['paid', 'due', 'overdue'])

export const studentInvoiceSchema = z.object({
  id: z.string(),
  invoiceNo: z.string(),
  title: z.string(),
  dueDate: z.string(),
  amountPaise: z.number().int().nonnegative(),
  paidPaise: z.number().int().nonnegative(),
  status: invoiceStatusSchema,
})

export const attendanceStatusSchema = z.enum(['present', 'absent', 'late', 'excused'])

export const attendanceRecordSchema = z.object({
  date: z.string(),
  status: attendanceStatusSchema,
  notes: z.string().optional(),
})

export const attendanceSummarySchema = z.object({
  presentDays: z.number().int().nonnegative(),
  absentDays: z.number().int().nonnegative(),
  lateDays: z.number().int().nonnegative(),
  totalDays: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
})

export const documentTypeSchema = z.enum([
  'birth_certificate',
  'transfer_certificate',
  'marksheet',
  'medical_record',
  'id_proof',
])

export const studentDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: documentTypeSchema,
  uploadDate: z.string(),
  fileSizeBytes: z.number().int().positive(),
  fileUrl: z.string(),
})

export const studentDetailSchema = studentSchema.extend({
  rollNo: z.string(),
  dob: z.string(),
  gender: genderSchema,
  bloodGroup: z.string(),
  admissionDate: z.string(),
  residentialAddress: z.string(),
  city: z.string(),
  pincode: z.string(),
  primaryGuardian: guardianDetailSchema,
  secondaryGuardian: guardianDetailSchema.optional(),
  siblings: z.array(siblingSchema),
  medical: medicalProfileSchema,
  feeSummary: z.object({
    totalBilledPaise: z.number().int().nonnegative(),
    totalPaidPaise: z.number().int().nonnegative(),
    balanceDuePaise: z.number().int().nonnegative(),
    status: feeStatusSchema,
  }),
  invoices: z.array(studentInvoiceSchema),
  attendanceSummary: attendanceSummarySchema,
  recentAttendance: z.array(attendanceRecordSchema),
  documents: z.array(studentDocumentSchema),
})
