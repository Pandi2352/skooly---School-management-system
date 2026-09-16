import { invariant } from '@/lib/assert'
import {
  ENROLLMENT_STATUSES,
  PAGE_SIZE_OPTIONS,
  SIBLING_FILTERS,
  SORT_DIRECTIONS,
  STUDENT_SORT_FIELDS,
  STUDENT_VIEWS,
} from '../constants'
import type {
  EnrollmentStatus,
  FeeStatus,
  SiblingFilter,
  SortDirection,
  StatusFilter,
  Student,
  StudentSort,
  StudentSortField,
  StudentView,
} from '../types/student.types'

// Business rules for students: pure functions, no React, no network. Tested in studentStatus.test.ts.

export const isStatusFilter = (value: string): value is StatusFilter =>
  value === 'all' || ENROLLMENT_STATUSES.some((status) => status === value)

export const isSiblingFilter = (value: string): value is SiblingFilter =>
  SIBLING_FILTERS.some((filter) => filter === value)

export const isStudentView = (value: string): value is StudentView =>
  STUDENT_VIEWS.some((view) => view === value)

export const isPageSize = (value: number) => PAGE_SIZE_OPTIONS.some((size) => size === value)

const isSortField = (value: string): value is StudentSortField =>
  STUDENT_SORT_FIELDS.some((field) => field === value)

const isSortDirection = (value: string): value is SortDirection =>
  SORT_DIRECTIONS.some((direction) => direction === value)

/** "name-asc" → { field: "name", direction: "asc" }; `null` for anything else. */
export function parseStudentSort(value: string) {
  const separator = value.lastIndexOf('-')
  const field = value.slice(0, separator)
  const direction = value.slice(separator + 1)
  return separator > 0 && isSortField(field) && isSortDirection(direction)
    ? { field, direction }
    : null
}

export const isStudentSort = (value: string): value is StudentSort =>
  parseStudentSort(value) !== null

export function sortParts(sort: StudentSort) {
  const parts = parseStudentSort(sort)
  invariant(parts, `Invalid student sort: ${sort}`)
  return parts
}

/** Clicking a column sorts ascending; clicking the sorted column again flips the direction. */
export function toggleStudentSort(current: StudentSort, field: StudentSortField): StudentSort {
  const { field: currentField, direction } = sortParts(current)
  return currentField === field && direction === 'asc' ? `${field}-desc` : `${field}-asc`
}

/** Fees not fully paid need follow-up from the accounts office. */
export const feeNeedsAttention = (status: FeeStatus) => status !== 'paid'

export const hasFeeDue = (student: Pick<Student, 'totalDuePaise'>) => student.totalDuePaise > 0

/** A pending admission is waiting for a decision from the front office. */
export const admissionNeedsAttention = (status: EnrollmentStatus) => status === 'pending'

export const hasSiblings = (student: Pick<Student, 'siblingCount'>) => student.siblingCount > 0

export const formatClassSection = ({ grade, section }: Pick<Student, 'grade' | 'section'>) =>
  `Class ${grade} · ${section}`

export const formatSiblingCount = (count: number) =>
  count === 1 ? '1 sibling' : `${count} siblings`
