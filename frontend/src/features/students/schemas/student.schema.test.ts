import { describe, expect, it } from 'vitest'
import { sampleStudents } from '../api/sample/sampleStudents'
import { studentSchema } from './student.schema'

describe('studentSchema', () => {
  it('accepts the sample students', () => {
    for (const student of sampleStudents) {
      expect(studentSchema.safeParse(student).success, student.id).toBe(true)
    }
  })

  it('rejects a fee status the app does not know', () => {
    const [first] = sampleStudents
    expect(studentSchema.safeParse({ ...first, feeStatus: 'waived' }).success).toBe(false)
  })

  it('rejects a missing field', () => {
    const [first] = sampleStudents
    expect(studentSchema.safeParse({ ...first, name: undefined }).success).toBe(false)
  })
})
