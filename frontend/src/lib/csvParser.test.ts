import { describe, expect, it } from 'vitest'
import { detectDelimiter, generateCsv, parseCsv } from './csvParser'

describe('csvParser', () => {
  it('detects comma, tab, and semicolon delimiters', () => {
    expect(detectDelimiter('Name,Grade,Section')).toBe(',')
    expect(detectDelimiter('Name\tGrade\tSection')).toBe('\t')
    expect(detectDelimiter('Name;Grade;Section')).toBe(';')
  })

  it('parses standard comma-separated text into rows', () => {
    const csv = 'Name,Grade,Section\nAarav Sharma,5,A\nDiya Patel,6,B'
    const rows = parseCsv(csv)
    expect(rows).toHaveLength(3)
    expect(rows[0]).toEqual(['Name', 'Grade', 'Section'])
    expect(rows[1]).toEqual(['Aarav Sharma', '5', 'A'])
    expect(rows[2]).toEqual(['Diya Patel', '6', 'B'])
  })

  it('handles quotes containing commas and escaped quotes', () => {
    const csv = 'Name,Address\n"Sharma, Aarav","42 Orchid, ""Block A"""'
    const rows = parseCsv(csv)
    expect(rows).toHaveLength(2)
    expect(rows[1]?.[0]).toBe('Sharma, Aarav')
    expect(rows[1]?.[1]).toBe('42 Orchid, "Block A"')
  })

  it('handles CRLF line breaks and BOM markers', () => {
    const csv = '\uFEFFName,Grade\r\nJohn,10\r\nJane,11\r\n'
    const rows = parseCsv(csv)
    expect(rows).toHaveLength(3)
    expect(rows[0]).toEqual(['Name', 'Grade'])
  })

  it('generates valid CSV string escaping special characters', () => {
    const input = [
      ['Name', 'Address'],
      ['Aarav, Jr.', '42 Orchid "Heights"'],
    ]
    const out = generateCsv(input)
    expect(out).toContain('"Aarav, Jr."')
    expect(out).toContain('"42 Orchid ""Heights"""')
  })
})
