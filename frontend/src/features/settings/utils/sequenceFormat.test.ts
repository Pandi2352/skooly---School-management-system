import { describe, expect, it } from 'vitest'
import type { DatedSequence, Sequence } from '../types/settings.types'
import { academicSessionStartYear, formatSequenceNumber } from './sequenceFormat'

const september2026 = new Date(2026, 8, 14)

const receipt: DatedSequence = {
  prefix: 'SPS',
  separator: 'slash',
  padding: '3',
  includeSession: true,
  sessionFormat: 'full',
  includeDate: true,
  dateFormat: 'yy',
  nextNumber: 1,
}

describe('academicSessionStartYear', () => {
  it('starts the session in April', () => {
    expect(academicSessionStartYear(new Date(2026, 3, 1))).toBe(2026)
    expect(academicSessionStartYear(new Date(2027, 2, 31))).toBe(2026)
  })
})

describe('formatSequenceNumber', () => {
  it('builds a fee receipt number', () => {
    expect(formatSequenceNumber(receipt, september2026)).toBe('SPS/2026-2027/26/001')
  })

  it('builds an admission number with month and year', () => {
    expect(
      formatSequenceNumber(
        { ...receipt, padding: '4', dateFormat: 'monyy', nextNumber: 3 },
        september2026,
      ),
    ).toBe('SPS/2026-2027/SEP26/0003')
  })

  it('builds a roll number with a short session and no counter', () => {
    const roll: Sequence = {
      prefix: 'ROLL',
      separator: 'slash',
      padding: '3',
      includeSession: true,
      sessionFormat: 'short',
    }
    expect(formatSequenceNumber(roll, september2026)).toBe('ROLL/26-27/001')
  })

  it('skips empty parts and joins without a separator when asked', () => {
    expect(
      formatSequenceNumber(
        { ...receipt, prefix: '', separator: 'none', includeSession: false, includeDate: false },
        september2026,
      ),
    ).toBe('001')
  })

  it('shows 1 while the counter is empty or invalid', () => {
    expect(formatSequenceNumber({ ...receipt, nextNumber: Number.NaN }, september2026)).toBe(
      'SPS/2026-2027/26/001',
    )
  })
})
