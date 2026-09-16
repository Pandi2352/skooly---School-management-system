import { studentSummarySchema } from '../schemas/student.schema'
import type { StudentSummary } from '../types/student.types'
import { sampleStudents } from './sample/sampleStudents'

/**
 * School-wide student counts for the page header.
 * TODO(api): return `api.get('/students/summary', studentSummarySchema)`.
 */
export async function getStudentSummary(): Promise<StudentSummary> {
  await Promise.resolve()
  return studentSummarySchema.parse({
    sessionTotal: sampleStudents.filter((s) => s.enrollmentStatus !== 'left').length,
    allTime: sampleStudents.length,
    // Every sample student has a class and section, so none are unassigned.
    unassigned: 0,
  })
}
