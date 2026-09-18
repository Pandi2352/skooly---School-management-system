import { describe, expect, it } from 'vitest'
import {
  calculateApplicantAge,
  formatAdmissionStatus,
  getAdmissionStatusTone,
  getVerifiedDocumentsCount,
} from './admissionsPipelineUtils'

describe('admissionsPipelineUtils', () => {
  it('formats admission statuses correctly', () => {
    expect(formatAdmissionStatus('under-review')).toBe('Under Review')
    expect(formatAdmissionStatus('approved')).toBe('Approved')
    expect(formatAdmissionStatus('enrolled')).toBe('Enrolled')
    expect(formatAdmissionStatus('rejected')).toBe('Rejected')
  })

  it('maps correct badge tone for each status', () => {
    expect(getAdmissionStatusTone('under-review')).toBe('planned')
    expect(getAdmissionStatusTone('approved')).toBe('success')
    expect(getAdmissionStatusTone('enrolled')).toBe('primary')
    expect(getAdmissionStatusTone('rejected')).toBe('danger')
    expect(getAdmissionStatusTone('draft')).toBe('neutral')
  })

  it('calculates verified documents count correctly', () => {
    const docs = [
      { name: 'Birth Cert', status: 'verified' as const },
      { name: 'Transfer Cert', status: 'pending' as const },
    ]
    const res = getVerifiedDocumentsCount(docs)
    expect(res.total).toBe(2)
    expect(res.verified).toBe(1)
    expect(res.isComplete).toBe(false)

    const allVerified = [
      { name: 'Birth Cert', status: 'verified' as const },
      { name: 'Transfer Cert', status: 'verified' as const },
    ]
    expect(getVerifiedDocumentsCount(allVerified).isComplete).toBe(true)
  })

  it('computes age accurately from DOB string', () => {
    const age = calculateApplicantAge('2015-01-01')
    expect(age).toBeGreaterThanOrEqual(10)
  })
})
