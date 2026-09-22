import { z } from 'zod'
import {
  DEPARTMENTS,
  EMPLOYMENT_STATUSES,
  EMPLOYMENT_TYPES,
} from '../constants'

// ── Embedded shapes ────────────────────────────────────────────────────────

const qualificationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  year: z.string(),
  grade: z.string().optional(),
})

const experienceSchema = z.object({
  institution: z.string(),
  designation: z.string(),
  from: z.string(),
  to: z.string().optional(),
  isCurrent: z.boolean().optional(),
})

const leaveBalanceSchema = z.object({
  casual: z.number().int().nonnegative(),
  medical: z.number().int().nonnegative(),
  earned: z.number().int().nonnegative(),
  maternity: z.number().int().nonnegative(),
  paternity: z.number().int().nonnegative(),
})

// ── Staff list row (summary) ──────────────────────────────────────────────

export const staffSummarySchema = z.object({
  id: z.string(),
  photoUrl: z.string().nullable(),
  personalInfo: z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    gender: z.string(),
  }),
  employment: z.object({
    employeeId: z.string(),
    designation: z.string(),
    department: z.enum(DEPARTMENTS),
    dateOfJoining: z.string(),
    employmentType: z.enum(EMPLOYMENT_TYPES),
    status: z.enum(EMPLOYMENT_STATUSES),
  }),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string().optional(),
  }),
})

// ── Staff full detail ─────────────────────────────────────────────────────

export const staffDetailSchema = staffSummarySchema.extend({
  personalInfo: z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    dateOfBirth: z.string().optional(),
    gender: z.string(),
    bloodGroup: z.string().optional(),
    aadhaarNumber: z.string().optional(),
    panNumber: z.string().optional(),
    religion: z.string().optional(),
    category: z.string().optional(),
  }),
  contactInfo: z.object({
    phone: z.string(),
    altPhone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
  }),
  employment: z.object({
    employeeId: z.string(),
    designation: z.string(),
    department: z.enum(DEPARTMENTS),
    dateOfJoining: z.string(),
    employmentType: z.enum(EMPLOYMENT_TYPES),
    status: z.enum(EMPLOYMENT_STATUSES),
    salaryPaise: z.number().int().nonnegative().optional(),
    reportingTo: z.string().optional(),
    dateOfLeaving: z.string().optional(),
  }),
  qualifications: z.array(qualificationSchema),
  experience: z.array(experienceSchema),
  leaveBalance: leaveBalanceSchema,
  subjects: z.array(z.string()),
  classes: z.array(z.string()),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// ── Staff page (paginated list) ───────────────────────────────────────────

export const staffPageSchema = z.object({
  rows: z.array(staffSummarySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageCount: z.number().int().min(1),
})

// ── Stats ─────────────────────────────────────────────────────────────────

export const staffStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  onLeave: z.number().int().nonnegative(),
  resigned: z.number().int().nonnegative(),
  pendingLeaves: z.number().int().nonnegative(),
  openJobs: z.number().int().nonnegative(),
  byDepartment: z.record(z.string(), z.number()),
})
