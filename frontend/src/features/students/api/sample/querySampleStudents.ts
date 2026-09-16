import type {
  Student,
  StudentFilters,
  StudentPage,
  StudentSortField,
} from '../../types/student.types'
import { sortParts } from '../../utils/studentStatus'
import { sampleStudents } from './sampleStudents'

const byText = (a: string, b: string) => a.localeCompare(b, 'en-IN', { numeric: true })

const compare: Record<StudentSortField, (a: Student, b: Student) => number> = {
  admissionNo: (a, b) => byText(a.admissionNo, b.admissionNo),
  rollNo: (a, b) => byText(a.rollNo, b.rollNo),
  name: (a, b) => byText(a.name, b.name),
  class: (a, b) => a.grade - b.grade || byText(a.section, b.section) || byText(a.name, b.name),
  fatherName: (a, b) => byText(a.fatherName, b.fatherName),
  fatherPhone: (a, b) => byText(a.fatherPhone, b.fatherPhone),
}

/**
 * Stands in for the server: search, filters, sort and paging, done the way the API will.
 * Deleted with the rest of this folder once the student endpoint exists.
 */
export function querySampleStudents(
  { status, classGrade, section, siblings, search, sort, page, pageSize }: StudentFilters,
  students: Student[] = sampleStudents,
): StudentPage {
  const term = search.trim().toLowerCase()
  const matching = students.filter(
    (s) =>
      (!term ||
        [s.name, s.admissionNo, s.rollNo, s.fatherName, s.fatherPhone].some((value) =>
          value.toLowerCase().includes(term),
        )) &&
      (classGrade === null || s.grade === classGrade) &&
      (section === null || s.section === section) &&
      (siblings === 'all' || (siblings === 'with') === s.siblingCount > 0),
  )

  const counts = { all: matching.length, enrolled: 0, pending: 0, left: 0 }
  for (const s of matching) counts[s.enrollmentStatus] += 1

  const filtered =
    status === 'all' ? matching : matching.filter((s) => s.enrollmentStatus === status)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const { field, direction } = sortParts(sort)
  const sign = direction === 'asc' ? 1 : -1
  const rows = [...filtered]
    .sort((a, b) => sign * compare[field](a, b))
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return { rows, total: filtered.length, page: currentPage, pageCount, counts }
}
