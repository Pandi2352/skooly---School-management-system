import { describe, expect, it } from 'vitest'
import { sampleStudents } from '../api/sample/sampleStudents'
import { studentsToTable, toCsv, toTsv } from './exportStudents'

describe('exportStudents', () => {
  const [first] = sampleStudents

  it('exports only visible, exportable columns with a header row', () => {
    const table = studentsToTable(sampleStudents.slice(0, 2), ['admissionNo', 'photo', 'name'])
    expect(table[0]).toEqual(['Adm. no.', 'Name'])
    expect(table).toHaveLength(3)
    expect(table[1]).toEqual([first?.admissionNo, first?.name])
  })

  it('quotes cells that contain commas, quotes or line breaks', () => {
    expect(toCsv([['a,b', 'say "hi"', 'plain']])).toBe('"a,b","say ""hi""",plain')
  })

  it('keeps phone numbers but neutralises formulas', () => {
    expect(toCsv([['+91 00000 00001', '=SUM(A1)', '-cmd']])).toBe("+91 00000 00001,'=SUM(A1),'-cmd")
  })

  it('makes tab-separated text safe to paste', () => {
    expect(toTsv([['a\tb', 'c\nd']])).toBe('a b\tc d')
  })
})
