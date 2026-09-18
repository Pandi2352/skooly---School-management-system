import { describe, expect, it } from 'vitest'
import { validateMappedRows } from './importValidator'

describe('importValidator', () => {
  it('identifies valid student rows and counts them', () => {
    const rows = [
      { name: 'Aarav Sharma', grade: '5', section: 'A' },
      { name: 'Diya Patel', grade: '6', section: 'B' },
    ]
    const res = validateMappedRows('students', rows)
    expect(res.validCount).toBe(2)
    expect(res.invalidCount).toBe(0)
    expect(res.allErrors).toHaveLength(0)
  })

  it('detects invalid grade numbers and missing student names', () => {
    const rows = [
      { name: '', grade: '5', section: 'A' },
      { name: 'John Doe', grade: '15', section: 'A' }, // Grade out of 1-12
    ]
    const res = validateMappedRows('students', rows)
    expect(res.validCount).toBe(0)
    expect(res.invalidCount).toBe(2)
    expect(res.allErrors.length).toBeGreaterThanOrEqual(2)
  })

  it('flags duplicate admission numbers in the candidate list', () => {
    const rows = [
      { name: 'Student 1', grade: '5', section: 'A', admissionNo: 'ADM-001' },
      { name: 'Student 2', grade: '5', section: 'B', admissionNo: 'ADM-001' },
    ]
    const res = validateMappedRows('students', rows)
    expect(res.validCount).toBe(1)
    expect(res.invalidCount).toBe(1)
  })
})
