import { describe, expect, it } from 'vitest'
import {
  averageRating,
  computeOverallRating,
  ratingLabel,
  ratingTone,
} from './evaluationUtils'

describe('evaluationUtils', () => {
  it('returns rating label and tone', () => {
    expect(ratingLabel(5)).toBe('Excellent')
    expect(ratingLabel(4)).toBe('Good')
    expect(ratingLabel(1)).toBe('Poor')
    expect(ratingTone(5)).toContain('emerald')
    expect(ratingTone(1)).toContain('rose')
  })

  it('calculates average rating correctly', () => {
    expect(averageRating([])).toBeNull()
    expect(
      averageRating([
        { overallRating: 4 },
        { overallRating: 5 },
        { overallRating: 3 },
      ]),
    ).toBe(4)
    expect(
      averageRating([
        { overallRating: 4 },
        { overallRating: 5 },
      ]),
    ).toBe(4.5)
  })

  it('computes overall rating from 5 criteria', () => {
    const scores = {
      subjectKnowledge: 4,
      classroomManagement: 4,
      communication: 5,
      punctuality: 3,
      teamwork: 4,
    }
    // sum = 20 / 5 = 4
    expect(computeOverallRating(scores)).toBe(4)

    const scores2 = {
      subjectKnowledge: 5,
      classroomManagement: 4,
      communication: 5,
      punctuality: 4,
      teamwork: 4,
    }
    // sum = 22 / 5 = 4.4
    expect(computeOverallRating(scores2)).toBe(4.4)
  })
})
