import { describe, expect, it } from 'vitest'
import {
  staffFullName,
  statusLabel,
  statusTone,
  typeLabel,
} from './staffStatus'

describe('staffStatus utils', () => {
  it('returns correct label for employment status', () => {
    expect(statusLabel('active')).toBe('Active')
    expect(statusLabel('inactive')).toBe('Inactive')
    expect(statusLabel('on-leave')).toBe('On Leave')
    expect(statusLabel('resigned')).toBe('Resigned')
    expect(statusLabel('terminated')).toBe('Terminated')
  })

  it('returns correct tone classes for employment status', () => {
    expect(statusTone('active')).toContain('emerald')
    expect(statusTone('on-leave')).toContain('amber')
    expect(statusTone('resigned')).toContain('rose')
  })

  it('returns correct label for employment type', () => {
    expect(typeLabel('permanent')).toBe('Permanent')
    expect(typeLabel('probation')).toBe('Probation')
    expect(typeLabel('contract')).toBe('Contract')
    expect(typeLabel('part-time')).toBe('Part-Time')
  })

  it('formats staff full name correctly', () => {
    expect(
      staffFullName({ firstName: 'Anand', lastName: 'Kumar' }),
    ).toBe('Anand Kumar')
    expect(
      staffFullName({ firstName: 'Priya', middleName: 'Rani', lastName: 'Sharma' }),
    ).toBe('Priya Rani Sharma')
    expect(
      staffFullName({ firstName: 'Rajesh', middleName: '', lastName: 'Singh' }),
    ).toBe('Rajesh Singh')
  })
})
