import { studentPageSchema } from '../schemas/student.schema'
import type { StudentFilters, StudentPage } from '../types/student.types'
import { querySampleStudents } from './sample/querySampleStudents'

// A short wait keeps the loading state visible, as it will be with the real API.
const SAMPLE_DELAY_MS = 250

/**
 * One page of students. The only function that knows where student data comes from.
 * TODO(api): build URLSearchParams from `filters`, return
 * `api.get('/students?…', studentPageSchema)` from '@/lib/api/client', and delete ./sample.
 */
export async function getStudents(filters: StudentFilters): Promise<StudentPage> {
  await new Promise((resolve) => setTimeout(resolve, SAMPLE_DELAY_MS))
  // Parsed exactly like a real response, so the sample source can't drift from the contract.
  return studentPageSchema.parse(querySampleStudents(filters))
}
