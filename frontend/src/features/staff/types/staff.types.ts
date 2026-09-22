import type { z } from 'zod'
import type {
  staffSummarySchema,
  staffDetailSchema,
  staffPageSchema,
  staffStatsSchema,
} from '../schemas/staff.schema'
import type { leaveApplicationSchema, leaveListSchema } from '../schemas/leave.schema'
import type { evaluationSchema } from '../schemas/evaluation.schema'
import type { jobPostingSchema, jobApplicantSchema } from '../schemas/recruitment.schema'
import type { Department, EmploymentStatus, LeaveStatus, LeaveType } from '../constants'

// Domain types come from schemas
export type StaffSummary = z.infer<typeof staffSummarySchema>
export type StaffDetail = z.infer<typeof staffDetailSchema>
export type StaffPage = z.infer<typeof staffPageSchema>
export type StaffStats = z.infer<typeof staffStatsSchema>
export type LeaveApplication = z.infer<typeof leaveApplicationSchema>
export type LeaveList = z.infer<typeof leaveListSchema>
export type Evaluation = z.infer<typeof evaluationSchema>
export type JobPosting = z.infer<typeof jobPostingSchema>
export type JobApplicant = z.infer<typeof jobApplicantSchema>

// Client-only filter shapes
export type StaffFilters = {
  search: string
  department: Department | ''
  status: EmploymentStatus | ''
  page: number
  limit: number
}

export type LeaveFilters = {
  staffId?: string
  leaveType: LeaveType | ''
  status: LeaveStatus | ''
  from: string
  to: string
}
