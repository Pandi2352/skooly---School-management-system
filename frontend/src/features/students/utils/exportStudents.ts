import type { Student } from '../types/student.types'
import { STUDENT_COLUMNS, studentColumnText, type StudentColumnKey } from './studentColumns'

/** Header row plus one row per student, limited to the visible, exportable columns. */
export function studentsToTable(students: Student[], visibleKeys: StudentColumnKey[]) {
  const columns = STUDENT_COLUMNS.filter(
    (column) => column.exportable && visibleKeys.includes(column.key),
  )
  return [
    columns.map((column) => column.label),
    ...students.map((student) => columns.map((column) => studentColumnText(student, column.key))),
  ]
}

// A cell starting with = @ or a + / - that isn't a number could run as a spreadsheet formula
// when the file is opened. Prefixing an apostrophe keeps it as text.
function neutraliseFormula(value: string) {
  return /^[=@\t\r]|^[+-](?![\d\s])/.test(value) ? `'${value}` : value
}

export function toCsv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const safe = neutraliseFormula(cell)
          return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe
        })
        .join(','),
    )
    .join('\r\n')
}

/** Tab-separated text: pastes into spreadsheets as columns. */
export function toTsv(rows: string[][]) {
  return rows
    .map((row) => row.map((cell) => neutraliseFormula(cell).replace(/[\t\r\n]+/g, ' ')).join('\t'))
    .join('\n')
}
