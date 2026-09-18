/**
 * RFC-4180 compliant CSV parser and generator.
 * Handles quoted fields, escaped quotes, commas, tabs, semicolons, and CRLF line breaks.
 */

export function detectDelimiter(headerLine: string): string {
  const commaCount = (headerLine.match(/,/g) ?? []).length
  const tabCount = (headerLine.match(/\t/g) ?? []).length
  const semicolonCount = (headerLine.match(/;/g) ?? []).length

  if (tabCount > commaCount && tabCount > semicolonCount) return '\t'
  if (semicolonCount > commaCount && semicolonCount > tabCount) return ';'
  return ','
}

export function parseCsv(text: string, customDelimiter?: string): string[][] {
  const clean = text.replace(/^\uFEFF/, '').trim()
  if (!clean) return []

  const firstLine = clean.split(/\r?\n/)[0] ?? ''
  const delimiter = customDelimiter ?? detectDelimiter(firstLine)

  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]
    if (!char) {
      continue
    }
    const nextChar = clean[i + 1]

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        currentField += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === delimiter) {
        currentRow.push(currentField.trim())
        currentField = ''
      } else if (char === '\r') {
        if (nextChar === '\n') i++
        currentRow.push(currentField.trim())
        rows.push(currentRow)
        currentRow = []
        currentField = ''
      } else if (char === '\n') {
        currentRow.push(currentField.trim())
        rows.push(currentRow)
        currentRow = []
        currentField = ''
      } else {
        currentField += char
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim())
    rows.push(currentRow)
  }

  // Filter out any completely empty rows
  return rows.filter((r) => r.some((cell) => cell.length > 0))
}

export function generateCsv(
  rows: (string | number | null | undefined)[][],
  delimiter = ',',
): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '')
          if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replaceAll('"', '""')}"`
          }
          return str
        })
        .join(delimiter),
    )
    .join('\r\n')
}
