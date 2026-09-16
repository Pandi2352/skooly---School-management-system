import { ApiError } from '@/lib/api/ApiError'
import { studentDetailSchema } from '../schemas/studentDetail.schema'
import type { StudentDetail } from '../types/student.types'
import { getSampleStudentDetail } from './sample/sampleStudentDetails'

const SAMPLE_DELAY_MS = 250

/**
 * Fetches one student profile by ID.
 * TODO(api): replace with `api.get('/students/' + studentId, studentDetailSchema)`
 * from '@/lib/api/client' and remove sample import.
 */
export async function getStudent(studentId: string): Promise<StudentDetail> {
  await new Promise((resolve) => setTimeout(resolve, SAMPLE_DELAY_MS))
  const sample = getSampleStudentDetail(studentId)
  if (!sample) {
    throw new ApiError(404, [`Student with ID "${studentId}" was not found.`])
  }
  return studentDetailSchema.parse(sample)
}
