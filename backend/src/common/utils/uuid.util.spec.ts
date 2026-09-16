import { generateUuid, isValidUuid } from './uuid.util'

describe('UUID Utility', () => {
  it('should generate a valid UUID v4', () => {
    const id = generateUuid()
    expect(id).toBeDefined()
    expect(typeof id).toBe('string')
    expect(isValidUuid(id)).toBe(true)
  })

  it('should generate unique UUIDs on successive calls', () => {
    const id1 = generateUuid()
    const id2 = generateUuid()
    expect(id1).not.toBe(id2)
  })

  it('should invalidate non-UUID strings and object IDs', () => {
    // Standard MongoDB 24-char hex ObjectId
    expect(isValidUuid('507f1f77bcf86cd799439011')).toBe(false)
    expect(isValidUuid('invalid-string')).toBe(false)
    expect(isValidUuid('')).toBe(false)
    expect(isValidUuid(null)).toBe(false)
    expect(isValidUuid(undefined)).toBe(false)
  })
})
