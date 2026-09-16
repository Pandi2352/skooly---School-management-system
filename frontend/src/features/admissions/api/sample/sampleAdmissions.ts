import type {
  AdmissionRequest,
  AdmissionResult,
  FeeGroup,
  NextNumbers,
  ParentAccount,
} from '../../types/admission.types'

// SAMPLE DATA: admissions made in this session until the admission API exists (antislop R-38).
// Nothing is sent to a server; the list resets when the page reloads, and the success screen says so.

let admissions: AdmissionResult[] = []

/** Placeholder parent accounts for "Link to Existing Parent Account". */
export const sampleParentAccounts: ParentAccount[] = Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return {
    id: `sample-parent-${number}`,
    name: `Sample Parent ${number}`,
    phone: `+91 90000 000${number}`,
    email: `parent${number}@example.com`,
    children: [`Sample Student ${number} (Class ${String((index % 10) + 1)} A)`],
  }
})

/** Placeholder fee groups until the Fees module supplies the school's own. */
export const sampleFeeGroups: FeeGroup[] = [
  { id: 'admission-2026', name: 'Admission Fees 2026-2027' },
  { id: 'tuition-2026', name: 'Tuition Fees 2026-2027' },
  { id: 'library-2026', name: 'Library Fees 2026-2027' },
  { id: 'exam-2026', name: 'Exam Fees 2026-2027' },
  { id: 'computer-lab-2026', name: 'Computer Lab Fees 2026-2027' },
  { id: 'sports-2026', name: 'Sports & Activities 2026-2027' },
  { id: 'transport-monthly', name: 'Transport Fee Monthly' },
  { id: 'opening-due', name: 'Opening Due Balance' },
]

/** Placeholder houses until the Student Houses feature supplies the school's own. */
export const sampleHouses = [
  { value: 'red', label: 'Red House' },
  { value: 'blue', label: 'Blue House' },
  { value: 'green', label: 'Green House' },
  { value: 'yellow', label: 'Yellow House' },
]

export function readSampleNextNumbers(grade: number | null, section: string): NextNumbers {
  return {
    admissionCounter: admissions.length + 1,
    rollCounter:
      grade === null || section === ''
        ? null
        : admissions.filter(
            (admission) => admission.grade === grade && admission.section === section,
          ).length + 1,
  }
}

export function saveSampleAdmission(request: AdmissionRequest, now: Date): AdmissionResult {
  const { admissionNo, rollNo, grade, section } = request.academic
  const sameText = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

  if (admissions.some((admission) => sameText(admission.admissionNo, admissionNo))) {
    throw new Error(
      `Admission number ${admissionNo} is already used. Enter another one, or press Auto.`,
    )
  }
  if (
    admissions.some(
      (admission) =>
        admission.grade === grade &&
        admission.section === section &&
        sameText(admission.rollNo, rollNo),
    )
  ) {
    throw new Error(`Roll number ${rollNo} is already used in this class and section.`)
  }

  const admission: AdmissionResult = {
    id: `sample-admission-${String(now.getTime())}`,
    admissionNo,
    rollNo,
    studentName: request.student.name,
    grade,
    section,
  }
  admissions = [...admissions, admission]
  return admission
}
