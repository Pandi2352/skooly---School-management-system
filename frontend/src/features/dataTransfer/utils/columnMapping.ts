import type { TemplateColumn } from '../schemas/dataTransfer.schema'

const ALIASES: Record<string, string[]> = {
  name: ['student full name', 'student name', 'full name', 'fullname', 'name', 'student'],
  fullName: ['staff full name', 'staff name', 'full name', 'fullname', 'name', 'employee name'],
  grade: ['grade', 'class', 'standard', 'std', 'class/grade', 'grade level'],
  section: ['section', 'sec', 'division', 'div'],
  admissionNo: ['admission number', 'admission no', 'adm no', 'adm number', 'registration no', 'reg no'],
  rollNo: ['roll number', 'roll no', 'roll', 'class roll'],
  phone: ['contact phone', 'phone number', 'phone', 'mobile number', 'mobile', 'contact', 'cell'],
  email: ['email address', 'email', 'e-mail', 'mail', 'login email'],
  roleName: ['role', 'role name', 'user role', 'account role', 'system role'],
  designation: ['designation', 'job title', 'title', 'position'],
  studentAdmissionNo: ['student admission no', 'student admission number', 'student adm no', 'student id'],
  guardianType: ['relationship', 'guardian type', 'relation', 'relation with student'],
  occupation: ['occupation', 'profession', 'job'],
  address: ['residential address', 'address', 'residence', 'home address'],
  status: ['status', 'enrollment status', 'account status'],
}

/**
 * Auto-maps target schema columns to source file headers.
 * Returns a dictionary mapping targetKey -> sourceHeader name (or empty string if unmapped).
 */
export function autoMapColumns(
  targetColumns: TemplateColumn[],
  fileHeaders: string[],
): Record<string, string> {
  const mapping: Record<string, string> = {}
  const usedHeaders = new Set<string>()

  for (const col of targetColumns) {
    const targetKeyLower = col.key.toLowerCase()
    const targetLabelLower = col.label.toLowerCase()
    const targetAliases = ALIASES[col.key] ?? []

    // 1. Direct exact key match
    const exact = fileHeaders.find(
      (h) => !usedHeaders.has(h) && h.trim().toLowerCase() === targetKeyLower,
    )
    if (exact) {
      mapping[col.key] = exact
      usedHeaders.add(exact)
      continue
    }

    // 2. Direct label match
    const labelMatch = fileHeaders.find(
      (h) => !usedHeaders.has(h) && h.trim().toLowerCase() === targetLabelLower,
    )
    if (labelMatch) {
      mapping[col.key] = labelMatch
      usedHeaders.add(labelMatch)
      continue
    }

    // 3. Synonym / alias match
    const aliasMatch = fileHeaders.find((h) => {
      if (usedHeaders.has(h)) return false
      const cleanH = h.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim()
      return (
        targetAliases.includes(cleanH) ||
        targetAliases.some((alias) => cleanH.includes(alias) || alias.includes(cleanH))
      )
    })

    if (aliasMatch) {
      mapping[col.key] = aliasMatch
      usedHeaders.add(aliasMatch)
    } else {
      mapping[col.key] = '' // unmapped
    }
  }

  return mapping
}

/**
 * Transforms a raw row using targetKey -> sourceHeader mapping.
 */
export function applyMappingToRow(
  rawRow: Record<string, string>,
  columnMap: Record<string, string>,
): Record<string, string> {
  const mappedRow: Record<string, string> = {}
  for (const [targetKey, sourceCol] of Object.entries(columnMap)) {
    if (sourceCol && rawRow[sourceCol] !== undefined) {
      mappedRow[targetKey] = (rawRow[sourceCol] ?? '').trim()
    }
  }
  return mappedRow
}

/**
 * Batch transform an array of raw CSV rows into mapped target records.
 */
export function remapRecords(
  rawRows: Record<string, string>[],
  columnMap: Record<string, string>,
): Record<string, string>[] {
  return rawRows.map((row) => applyMappingToRow(row, columnMap))
}
