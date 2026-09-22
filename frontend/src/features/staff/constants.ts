export const EMPLOYMENT_STATUSES = ['active', 'inactive', 'on-leave', 'resigned', 'terminated'] as const
export const EMPLOYMENT_TYPES = ['permanent', 'probation', 'contract', 'part-time'] as const
export const LEAVE_TYPES = ['casual', 'medical', 'earned', 'maternity', 'paternity', 'unpaid'] as const
export const LEAVE_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'] as const
export const JOB_STATUSES = ['open', 'closed', 'filled'] as const
export const APPLICANT_STATUSES = ['received', 'shortlisted', 'interview-scheduled', 'hired', 'rejected'] as const

export const DEPARTMENTS = [
  'Primary',
  'Secondary',
  'Senior Secondary',
  'Administration',
  'Accounts',
  'Library',
  'Sports',
  'Arts',
  'Science Lab',
  'Support Staff',
] as const

export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number]
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]
export type LeaveType = (typeof LEAVE_TYPES)[number]
export type LeaveStatus = (typeof LEAVE_STATUSES)[number]
export type JobStatus = (typeof JOB_STATUSES)[number]
export type ApplicantStatus = (typeof APPLICANT_STATUSES)[number]
export type Department = (typeof DEPARTMENTS)[number]
