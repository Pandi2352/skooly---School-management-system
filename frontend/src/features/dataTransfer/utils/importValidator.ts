import type { EntityType, ImportRowError } from '../schemas/dataTransfer.schema'

export type ValidatedRow = {
  rowNumber: number
  data: Record<string, string>
  isValid: boolean
  errors: string[]
}

export function validateMappedRows(
  entityType: EntityType,
  rows: Record<string, string>[],
): {
  validatedRows: ValidatedRow[]
  allErrors: ImportRowError[]
  validCount: number
  invalidCount: number
} {
  const validatedRows: ValidatedRow[] = []
  const allErrors: ImportRowError[] = []
  const seenKeys = new Set<string>()

  for (let i = 0; i < rows.length; i++) {
    const data = rows[i] ?? {}
    const rowNumber = i + 1
    const rowErrors: string[] = []

    if (entityType === 'students') {
      const name = data.name?.trim()
      if (!name) {
        rowErrors.push('Student name is required.')
        allErrors.push({ rowNumber, field: 'name', message: 'Student name is required.' })
      }

      const grade = Number(data.grade)
      if (!data.grade || isNaN(grade) || grade < 1 || grade > 12) {
        rowErrors.push('Grade must be between 1 and 12.')
        allErrors.push({ rowNumber, field: 'grade', message: 'Grade must be between 1 and 12.' })
      }

      const section = data.section?.trim()
      if (!section) {
        rowErrors.push('Section is required.')
        allErrors.push({ rowNumber, field: 'section', message: 'Section is required.' })
      }

      const admissionNo = data.admissionNo?.trim().toLowerCase()
      if (admissionNo) {
        if (seenKeys.has(`adm:${admissionNo}`)) {
          rowErrors.push(`Duplicate admission number: ${data.admissionNo}`)
          allErrors.push({ rowNumber, field: 'admissionNo', message: 'Duplicate admission number in file.' })
        }
        seenKeys.add(`adm:${admissionNo}`)
      }
    } else if (entityType === 'parents') {
      if (!data.studentAdmissionNo?.trim()) {
        rowErrors.push('Student admission number is required.')
        allErrors.push({ rowNumber, field: 'studentAdmissionNo', message: 'Student admission number is required.' })
      }
      if (!data.name?.trim()) {
        rowErrors.push('Parent name is required.')
        allErrors.push({ rowNumber, field: 'name', message: 'Parent name is required.' })
      }
      if (!data.phone?.trim()) {
        rowErrors.push('Phone number is required.')
        allErrors.push({ rowNumber, field: 'phone', message: 'Phone number is required.' })
      }
    } else {
      if (!data.fullName?.trim()) {
        rowErrors.push('Staff full name is required.')
        allErrors.push({ rowNumber, field: 'fullName', message: 'Staff full name is required.' })
      }

      const email = data.email?.trim().toLowerCase()
      if (!email?.includes('@')) {
        rowErrors.push('A valid email address is required.')
        allErrors.push({ rowNumber, field: 'email', message: 'A valid email address is required.' })
      } else if (seenKeys.has(`email:${email}`)) {
        rowErrors.push(`Duplicate email in file: ${data.email}`)
        allErrors.push({ rowNumber, field: 'email', message: 'Duplicate email in file.' })
      }
      if (email) seenKeys.add(`email:${email}`)
    }

    const isValid = rowErrors.length === 0
    validatedRows.push({
      rowNumber,
      data,
      isValid,
      errors: rowErrors,
    })
  }

  const validCount = validatedRows.filter((r) => r.isValid).length
  const invalidCount = validatedRows.length - validCount

  return {
    validatedRows,
    allErrors,
    validCount,
    invalidCount,
  }
}

export const validateImportRows = validateMappedRows

