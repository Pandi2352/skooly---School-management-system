import { formatMoney } from '@/lib/format'
import type { EnrollmentStatus, Student, StudentSortField } from '../types/student.types'
import { formatClassSection } from './studentStatus'

// One definition of the list's columns, shared by the table, the Columns menu and exports.

export type StudentColumnKey =
  | 'admissionNo'
  | 'rollNo'
  | 'photo'
  | 'name'
  | 'class'
  | 'outcome'
  | 'siblings'
  | 'fatherName'
  | 'fatherPhone'
  | 'totalAssigned'
  | 'totalDue'

export type StudentColumn = {
  key: StudentColumnKey
  label: string
  sortField?: StudentSortField
  /** The name column identifies the row, so it can't be hidden. */
  hideable: boolean
  /** Photos can't be copied into a spreadsheet. */
  exportable: boolean
  align?: 'start' | 'end'
}

export const STUDENT_COLUMNS: StudentColumn[] = [
  {
    key: 'admissionNo',
    label: 'Adm. no.',
    sortField: 'admissionNo',
    hideable: true,
    exportable: true,
  },
  { key: 'rollNo', label: 'Roll no.', sortField: 'rollNo', hideable: true, exportable: true },
  { key: 'photo', label: 'Photo', hideable: true, exportable: false },
  { key: 'name', label: 'Name', sortField: 'name', hideable: false, exportable: true },
  { key: 'class', label: 'Class', sortField: 'class', hideable: true, exportable: true },
  { key: 'outcome', label: 'Status', hideable: true, exportable: true },
  { key: 'siblings', label: 'Siblings', hideable: true, exportable: true },
  {
    key: 'fatherName',
    label: 'Father name',
    sortField: 'fatherName',
    hideable: true,
    exportable: true,
  },
  {
    key: 'fatherPhone',
    label: 'Father phone',
    sortField: 'fatherPhone',
    hideable: true,
    exportable: true,
  },
  { key: 'totalAssigned', label: 'Total assigned', hideable: true, exportable: true, align: 'end' },
  { key: 'totalDue', label: 'Total due', hideable: true, exportable: true, align: 'end' },
]

export const isStudentColumnKey = (value: string): value is StudentColumnKey =>
  STUDENT_COLUMNS.some((column) => column.key === value)

export const enrollmentLabels: Record<EnrollmentStatus, string> = {
  enrolled: 'Studying',
  pending: 'Admission pending',
  left: 'Left school',
}

/** Plain-text value of a cell, for copying and CSV. */
export function studentColumnText(student: Student, key: StudentColumnKey): string {
  switch (key) {
    case 'admissionNo':
      return student.admissionNo
    case 'rollNo':
      return student.rollNo
    case 'photo':
      return ''
    case 'name':
      return student.name
    case 'class':
      return formatClassSection(student)
    case 'outcome':
      return enrollmentLabels[student.enrollmentStatus]
    case 'siblings':
      return String(student.siblingCount)
    case 'fatherName':
      return student.fatherName
    case 'fatherPhone':
      return student.fatherPhone
    case 'totalAssigned':
      return formatMoney(student.totalAssignedPaise)
    case 'totalDue':
      return formatMoney(student.totalDuePaise)
  }
}
