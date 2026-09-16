import { describe, expect, it } from 'vitest'
import {
  admissionNeedsAttention,
  feeNeedsAttention,
  formatClassSection,
  formatSiblingCount,
  hasFeeDue,
  isSiblingFilter,
  isStatusFilter,
  isStudentSort,
  parseStudentSort,
  toggleStudentSort,
} from './studentStatus'

describe('student status rules', () => {
  it('flags fees that are not fully paid', () => {
    expect(feeNeedsAttention('paid')).toBe(false)
    expect(feeNeedsAttention('due')).toBe(true)
    expect(feeNeedsAttention('overdue')).toBe(true)
    expect(hasFeeDue({ totalDuePaise: 0 })).toBe(false)
    expect(hasFeeDue({ totalDuePaise: 1 })).toBe(true)
  })

  it('flags only pending admissions', () => {
    expect(admissionNeedsAttention('pending')).toBe(true)
    expect(admissionNeedsAttention('enrolled')).toBe(false)
    expect(admissionNeedsAttention('left')).toBe(false)
  })

  it('rejects unknown values from the URL', () => {
    expect(isStatusFilter('pending')).toBe(true)
    expect(isStatusFilter('all')).toBe(true)
    expect(isStatusFilter('deleted')).toBe(false)
    expect(isSiblingFilter('with')).toBe(true)
    expect(isSiblingFilter('some')).toBe(false)
    expect(isStudentSort('class-asc')).toBe(true)
    expect(isStudentSort('fatherPhone-desc')).toBe(true)
    expect(isStudentSort('price')).toBe(false)
    expect(isStudentSort('name-sideways')).toBe(false)
  })

  it('parses and toggles column sorting', () => {
    expect(parseStudentSort('rollNo-desc')).toEqual({ field: 'rollNo', direction: 'desc' })
    expect(toggleStudentSort('name-asc', 'name')).toBe('name-desc')
    expect(toggleStudentSort('name-desc', 'name')).toBe('name-asc')
    expect(toggleStudentSort('name-desc', 'rollNo')).toBe('rollNo-asc')
  })

  it('formats class, section and sibling counts', () => {
    expect(formatClassSection({ grade: 5, section: 'B' })).toBe('Class 5 · B')
    expect(formatSiblingCount(1)).toBe('1 sibling')
    expect(formatSiblingCount(3)).toBe('3 siblings')
  })
})
