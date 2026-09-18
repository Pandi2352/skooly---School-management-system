import { describe, expect, it } from 'vitest'
import type { TemplateColumn } from '../schemas/dataTransfer.schema'
import { applyMappingToRow, autoMapColumns, remapRecords } from './columnMapping'

describe('columnMapping', () => {
  const studentColumns: TemplateColumn[] = [
    { key: 'name', label: 'Student Full Name', required: true, description: '', example: '' },
    { key: 'grade', label: 'Grade / Class', required: true, description: '', example: '' },
    { key: 'section', label: 'Section', required: true, description: '', example: '' },
    { key: 'admissionNo', label: 'Admission Number', required: false, description: '', example: '' },
    { key: 'phone', label: 'Contact Phone', required: false, description: '', example: '' },
  ]

  it('accurately auto-maps common header synonyms to schema keys', () => {
    const fileHeaders = ['Full Name', 'Standard', 'Division', 'Mobile', 'Registration No']
    const mapping = autoMapColumns(studentColumns, fileHeaders)

    expect(mapping.name).toBe('Full Name')
    expect(mapping.grade).toBe('Standard')
    expect(mapping.section).toBe('Division')
    expect(mapping.phone).toBe('Mobile')
    expect(mapping.admissionNo).toBe('Registration No')
  })

  it('maps unrecognised headers to empty string', () => {
    const fileHeaders = ['Random Column 123']
    const mapping = autoMapColumns(studentColumns, fileHeaders)
    expect(mapping.name).toBe('')
    expect(mapping.grade).toBe('')
  })

  it('applies mapping dictionary to transform raw rows', () => {
    const raw = {
      'Student Name': 'Aarav Sharma',
      Class: '5',
      Sec: 'A',
    }
    const mapping = {
      name: 'Student Name',
      grade: 'Class',
      section: 'Sec',
    }
    const result = applyMappingToRow(raw, mapping)
    expect(result).toEqual({
      name: 'Aarav Sharma',
      grade: '5',
      section: 'A',
    })

    const batch = remapRecords([raw], mapping)
    expect(batch).toEqual([
      {
        name: 'Aarav Sharma',
        grade: '5',
        section: 'A',
      },
    ])
  })
})
