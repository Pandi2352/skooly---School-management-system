import type { ClassOption } from '../../types/student.types'

// SAMPLE DATA: classes 1 to 10 with sections A and B, matching sampleStudents.ts.
export const sampleClasses: ClassOption[] = Array.from({ length: 10 }, (_, index) => ({
  grade: index + 1,
  label: `Class ${index + 1}`,
  sections: ['A', 'B'],
}))
