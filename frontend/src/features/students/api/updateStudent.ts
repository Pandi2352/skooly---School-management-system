import { studentDetailSchema } from '../schemas/studentDetail.schema'
import type { StudentDetail } from '../types/student.types'
import { updateSampleStudentDetail } from './sample/sampleStudentDetails'

export async function updateStudent(
  studentId: string,
  updates: Partial<StudentDetail>,
): Promise<StudentDetail> {
  // Simulates brief network latency
  await new Promise((resolve) => setTimeout(resolve, 200))
  const updated = updateSampleStudentDetail(studentId, updates)
  return studentDetailSchema.parse(updated)
}
