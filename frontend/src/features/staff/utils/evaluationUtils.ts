import type { Evaluation } from '../types/staff.types'

export const RATING_LABEL: Record<number, string> = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
}

export const RATING_TONE: Record<number, string> = {
  1: 'text-rose-600',
  2: 'text-orange-500',
  3: 'text-amber-500',
  4: 'text-emerald-600',
  5: 'text-emerald-700 font-semibold',
}

export function ratingLabel(rating: number): string {
  const rounded = Math.round(rating)
  return RATING_LABEL[rounded] ?? 'Unknown'
}

export function ratingTone(rating: number): string {
  const rounded = Math.round(rating)
  return RATING_TONE[rounded] ?? ''
}

/**
 * Average overall rating across a list of evaluations, rounded to one decimal.
 * Returns null when the list is empty.
 */
export function averageRating(evals: Pick<Evaluation, 'overallRating'>[]): number | null {
  if (evals.length === 0) return null
  const sum = evals.reduce((acc, e) => acc + e.overallRating, 0)
  return Math.round((sum / evals.length) * 10) / 10
}

/**
 * Computes the auto overall rating as the mean of the 5 criteria scores,
 * rounded to one decimal.
 */
export function computeOverallRating(scores: {
  subjectKnowledge: number
  classroomManagement: number
  communication: number
  punctuality: number
  teamwork: number
}): number {
  const vals = [
    scores.subjectKnowledge,
    scores.classroomManagement,
    scores.communication,
    scores.punctuality,
    scores.teamwork,
  ]
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length
  return Math.round(avg * 10) / 10
}
