import { describe, expect, it } from 'vitest'
import {
  countLeaveDays,
  hasLeaveBalance,
  leaveStatusTone,
  leaveTypeLabel,
} from './leaveUtils'

describe('leaveUtils', () => {
  it('maps leave type to human-readable label', () => {
    expect(leaveTypeLabel('casual')).toBe('Casual Leave')
    expect(leaveTypeLabel('medical')).toBe('Medical Leave')
    expect(leaveTypeLabel('earned')).toBe('Earned Leave')
  })

  it('maps leave status to tone class', () => {
    expect(leaveStatusTone('pending')).toContain('amber')
    expect(leaveStatusTone('approved')).toContain('emerald')
    expect(leaveStatusTone('rejected')).toContain('rose')
  })

  it('calculates working days skipping weekends', () => {
    // 2026-09-14 is Monday, 2026-09-18 is Friday (5 working days)
    expect(countLeaveDays('2026-09-14', '2026-09-18')).toBe(5)

    // 2026-09-18 (Fri) to 2026-09-21 (Mon) -> Fri, Mon = 2 working days
    expect(countLeaveDays('2026-09-18', '2026-09-21')).toBe(2)

    // Invalid or backwards dates
    expect(countLeaveDays('2026-09-21', '2026-09-18')).toBe(0)
    expect(countLeaveDays('invalid', '2026-09-18')).toBe(0)
  })

  it('checks leave balance correctly', () => {
    const balance = { casual: 5, medical: 2, earned: 0 }
    expect(hasLeaveBalance(balance, 'casual', 3)).toBe(true)
    expect(hasLeaveBalance(balance, 'casual', 6)).toBe(false)
    expect(hasLeaveBalance(balance, 'earned', 1)).toBe(false)
    // Unpaid leave always has balance
    expect(hasLeaveBalance(balance, 'unpaid', 10)).toBe(true)
  })
})
