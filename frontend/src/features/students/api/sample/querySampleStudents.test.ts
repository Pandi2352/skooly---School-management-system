import { describe, expect, it } from 'vitest'
import type { StudentFilters } from '../../types/student.types'
import { querySampleStudents } from './querySampleStudents'

const base: StudentFilters = {
  status: 'all',
  classGrade: null,
  section: null,
  siblings: 'all',
  search: '',
  sort: 'name-asc',
  page: 1,
  pageSize: 10,
}

describe('querySampleStudents', () => {
  it('pages the results', () => {
    const result = querySampleStudents(base)
    expect(result.rows).toHaveLength(10)
    expect(result.total).toBe(26)
    expect(result.pageCount).toBe(3)
  })

  it('filters by status and still counts every status', () => {
    const result = querySampleStudents({ ...base, status: 'pending' })
    expect(result.rows.every((s) => s.enrollmentStatus === 'pending')).toBe(true)
    expect(result.counts.all).toBe(26)
    expect(result.counts.enrolled + result.counts.pending + result.counts.left).toBe(26)
  })

  it('searches by name, admission number or father name', () => {
    expect(querySampleStudents({ ...base, search: 'student 07' }).rows.map((s) => s.name)).toEqual([
      'Sample Student 07',
    ])
    expect(querySampleStudents({ ...base, search: 'sample-0012' }).total).toBe(1)
    expect(querySampleStudents({ ...base, search: 'father 03' }).total).toBe(1)
  })

  it('filters by class, section and siblings', () => {
    const classFive = querySampleStudents({ ...base, classGrade: 5, pageSize: 100 })
    expect(classFive.rows.every((s) => s.grade === 5)).toBe(true)
    const classFiveA = querySampleStudents({ ...base, classGrade: 5, section: 'A', pageSize: 100 })
    expect(classFiveA.rows.every((s) => s.grade === 5 && s.section === 'A')).toBe(true)
    const withSiblings = querySampleStudents({ ...base, siblings: 'with', pageSize: 100 })
    expect(withSiblings.rows.every((s) => s.siblingCount > 0)).toBe(true)
    const withoutSiblings = querySampleStudents({ ...base, siblings: 'without', pageSize: 100 })
    expect(withSiblings.total + withoutSiblings.total).toBe(26)
  })

  it('clamps a page past the end', () => {
    expect(querySampleStudents({ ...base, page: 99 }).page).toBe(3)
  })

  it('sorts by any sortable column, in both directions', () => {
    const grades = querySampleStudents({ ...base, sort: 'class-asc', pageSize: 26 }).rows.map(
      (s) => s.grade,
    )
    expect(grades).toEqual([...grades].sort((a, b) => a - b))
    const names = querySampleStudents({ ...base, sort: 'name-desc', pageSize: 3 }).rows
    expect(names[0]?.name).toBe('Sample Student 26')
  })
})
