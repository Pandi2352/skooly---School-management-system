import type { EmploymentStatus, EmploymentType } from '../constants'

// Status → display label
export const STATUS_LABEL: Record<EmploymentStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  'on-leave': 'On Leave',
  resigned: 'Resigned',
  terminated: 'Terminated',
}

// Status → Tailwind tone classes (background + text)
export const STATUS_TONE: Record<EmploymentStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  inactive: 'bg-slate-400/15 text-slate-600 dark:text-slate-400',
  'on-leave': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  resigned: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  terminated: 'bg-red-600/15 text-red-700 dark:text-red-400',
}

export function statusLabel(status: EmploymentStatus): string {
  return STATUS_LABEL[status]
}

export function statusTone(status: EmploymentStatus): string {
  return STATUS_TONE[status]
}

// Employment type → display label
export const TYPE_LABEL: Record<EmploymentType, string> = {
  permanent: 'Permanent',
  probation: 'Probation',
  contract: 'Contract',
  'part-time': 'Part-Time',
}

export function typeLabel(type: EmploymentType): string {
  return TYPE_LABEL[type]
}

/** Full display name from separate first/last/middle parts. */
export function staffFullName(personalInfo: {
  firstName: string
  middleName?: string
  lastName: string
}): string {
  return [personalInfo.firstName, personalInfo.middleName, personalInfo.lastName]
    .filter(Boolean)
    .join(' ')
}
