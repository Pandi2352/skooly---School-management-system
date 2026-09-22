import type { Staff } from '../schemas/staff.schema'
import type { LeaveApplication } from '../schemas/leave-application.schema'
import type { StaffEvaluation } from '../schemas/evaluation.schema'
import type { JobPosting } from '../schemas/job-posting.schema'
import type { JobApplicant } from '../schemas/job-applicant.schema'

export type PaginatedStaffResponse = {
  rows: Staff[]
  total: number
  page: number
  pageCount: number
}

export type StaffStatsResponse = {
  total: number
  active: number
  onLeave: number
  resigned: number
  byDepartment: Record<string, number>
  byStatus?: Record<string, number>
  pendingLeaves: number
  openJobs: number
}

export type {
  Staff,
  LeaveApplication,
  StaffEvaluation,
  JobPosting,
  JobApplicant,
}
