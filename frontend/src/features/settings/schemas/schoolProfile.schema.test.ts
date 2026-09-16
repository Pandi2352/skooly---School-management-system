import { describe, expect, it } from 'vitest'
import { readSampleSchoolProfile } from '../api/sample/sampleSchoolProfile'
import { schoolProfileSchema } from './schoolProfile.schema'

const valid = readSampleSchoolProfile()
const messagesFor = (values: unknown) => {
  const result = schoolProfileSchema.safeParse(values)
  return result.success ? [] : result.error.issues.map((issue) => issue.message)
}

describe('schoolProfileSchema', () => {
  it('accepts the sample profile', () => {
    expect(schoolProfileSchema.safeParse(valid).success).toBe(true)
  })

  it('requires a school name and a valid email', () => {
    expect(messagesFor({ ...valid, schoolName: ' ', email: 'not-an-email' })).toEqual([
      'Enter the school’s full name',
      'Enter a valid email address, like office@school.in',
    ])
  })

  it('allows an empty phone number but rejects letters', () => {
    expect(schoolProfileSchema.safeParse({ ...valid, phone: '' }).success).toBe(true)
    expect(schoolProfileSchema.safeParse({ ...valid, phone: '+91 98765 43210' }).success).toBe(true)
    expect(messagesFor({ ...valid, phone: 'call me' })).toEqual([
      'Enter a valid phone number, like +91 98765 43210',
    ])
  })

  it('limits the short name to 10 characters', () => {
    expect(messagesFor({ ...valid, shortName: 'ELEVENCHARS' })).toEqual([
      'Use 10 characters or fewer',
    ])
  })
})
