import type { EnrollmentStatus, FeeStatus, Student } from '../../types/student.types'

// SAMPLE DATA, NOT REAL STUDENTS. The list page shows a visible "Sample data" label while this is
// in use (antislop R-38). No photos: the list shows initials rather than invented faces.
// Delete the whole sample folder once getStudents calls the backend.

const enrollment: EnrollmentStatus[] = [
  'enrolled',
  'enrolled',
  'enrolled',
  'pending',
  'enrolled',
  'left',
]
const fees: FeeStatus[] = ['paid', 'due', 'paid', 'overdue', 'paid', 'due', 'paid']

// Matches the three ₹40,000 terms in sampleStudentDetails.ts, so list and profile agree.
const TERM_PAISE = 4_000_000
const TOTAL_ASSIGNED_PAISE = TERM_PAISE * 3

export const sampleStudents: Student[] = Array.from({ length: 26 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  const feeStatus = fees[index % fees.length] ?? 'paid'
  return {
    id: `sample-${number}`,
    admissionNo: `SAMPLE-00${number}`,
    rollNo: String((index % 35) + 1).padStart(2, '0'),
    name: `Sample Student ${number}`,
    grade: (index % 10) + 1,
    section: index % 2 === 0 ? 'A' : 'B',
    photoUrl: null,
    guardianName: `Sample Guardian ${number}`,
    guardianPhone: `+91 00000 000${number}`,
    fatherName: `Sample Father ${number}`,
    fatherPhone: `+91 00000 100${number}`,
    // Same rule as the siblings in sampleStudentDetails.ts.
    siblingCount: index % 3 !== 0 ? 1 : 0,
    totalAssignedPaise: TOTAL_ASSIGNED_PAISE,
    totalDuePaise: feeStatus === 'paid' ? 0 : TERM_PAISE,
    enrollmentStatus: enrollment[index % enrollment.length] ?? 'enrolled',
    feeStatus,
  }
})
