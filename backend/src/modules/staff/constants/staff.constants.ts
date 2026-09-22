export const STAFF_PERMISSIONS = {
  view: 'hr-staff-management.staff-management:view',
  create: 'hr-staff-management.staff-management:create',
  edit: 'hr-staff-management.staff-management:edit',
  delete: 'hr-staff-management.staff-management:delete',
} as const

export const LEAVE_PERMISSIONS = {
  view: 'hr-staff-management.staff-leave-management:view',
  create: 'hr-staff-management.staff-leave-management:create',
  edit: 'hr-staff-management.staff-leave-management:edit',
  delete: 'hr-staff-management.staff-leave-management:delete',
} as const

export const EVALUATION_PERMISSIONS = {
  view: 'hr-staff-management.teacher-evaluations:view',
  create: 'hr-staff-management.teacher-evaluations:create',
  edit: 'hr-staff-management.teacher-evaluations:edit',
  delete: 'hr-staff-management.teacher-evaluations:delete',
} as const

export const RECRUITMENT_PERMISSIONS = {
  view: 'hr-staff-management.recruitment-hiring:view',
  create: 'hr-staff-management.recruitment-hiring:create',
  edit: 'hr-staff-management.recruitment-hiring:edit',
  delete: 'hr-staff-management.recruitment-hiring:delete',
} as const

export const EMPLOYMENT_STATUSES = ['active', 'inactive', 'on-leave', 'resigned', 'terminated'] as const
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number]

export const EMPLOYMENT_TYPES = ['permanent', 'probation', 'contract', 'part-time'] as const
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]

export const LEAVE_TYPES = ['casual', 'medical', 'earned', 'maternity', 'paternity', 'unpaid'] as const
export type LeaveType = (typeof LEAVE_TYPES)[number]

export const LEAVE_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'] as const
export type LeaveStatus = (typeof LEAVE_STATUSES)[number]

export const JOB_STATUSES = ['open', 'closed', 'filled'] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

export const APPLICANT_STATUSES = ['received', 'shortlisted', 'interview-scheduled', 'hired', 'rejected'] as const
export type ApplicantStatus = (typeof APPLICANT_STATUSES)[number]

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
export type Department = (typeof DEPARTMENTS)[number]
