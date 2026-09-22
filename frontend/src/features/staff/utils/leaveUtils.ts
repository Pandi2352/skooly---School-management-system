import type { LeaveStatus, LeaveType } from '../constants'

// Leave type → display label
export const LEAVE_TYPE_LABEL: Record<LeaveType, string> = {
  casual: 'Casual Leave',
  medical: 'Medical Leave',
  earned: 'Earned Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  unpaid: 'Unpaid Leave',
}

// Leave status → Tailwind tone
export const LEAVE_STATUS_TONE: Record<LeaveStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  rejected: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  cancelled: 'bg-slate-400/15 text-slate-600 dark:text-slate-400',
}

export function leaveTypeLabel(type: LeaveType): string {
  return LEAVE_TYPE_LABEL[type]
}

export function leaveStatusTone(status: LeaveStatus): string {
  return LEAVE_STATUS_TONE[status]
}

/**
 * Count working days between two ISO date strings (inclusive).
 * Skips Saturdays and Sundays. No public holiday adjustment.
 */
export function countLeaveDays(fromDate: string, toDate: string): number {
  const start = new Date(`${fromDate}T00:00:00`)
  const end = new Date(`${toDate}T23:59:59`)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0
  let days = 0
  const cursor = new Date(start)
  while (cursor <= end) {
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) days++
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

/**
 * Returns true when the balance type has enough days for `requested`.
 */
export function hasLeaveBalance(
  balance: Record<string, number>,
  type: LeaveType,
  requested: number,
): boolean {
  if (type === 'unpaid') return true
  return (balance[type] ?? 0) >= requested
}
