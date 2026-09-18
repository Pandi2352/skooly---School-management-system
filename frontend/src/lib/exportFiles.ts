// Excel and PDF exports for tables. Each library is imported only when someone clicks that
// format, so neither adds to the page's initial download. `rows[0]` is the header row.

import { generateCsv } from './csvParser'

/** Downloads a real .xlsx workbook with a bold header row. */
export async function downloadXlsxTable(fileName: string, rows: string[][]) {
  const { default: writeXlsxFile } = await import('write-excel-file/browser')
  const [header = [], ...body] = rows
  const sheet = [
    header.map((value) => ({ value, fontWeight: 'bold' as const })),
    ...body.map((row) => row.map((value) => ({ value }))),
  ]
  await writeXlsxFile(sheet).toFile(fileName)
}

/** Downloads a standard UTF-8 CSV file. */
export function downloadCsvFile(fileName: string, rows: (string | number | null | undefined)[][]) {
  const csvContent = generateCsv(rows)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// jsPDF's built-in fonts can't draw ₹, so amounts are written as "Rs" in PDFs only.
const pdfSafe = (value: string) => value.replaceAll('₹', 'Rs ')

/** Downloads an A4 landscape PDF: title, then the table with a navy header row. */
export async function downloadPdfTable(fileName: string, title: string, rows: string[][]) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const [header = [], ...body] = rows

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  doc.setFontSize(16)
  doc.text(title, 40, 40)
  autoTable(doc, {
    head: [header.map(pdfSafe)],
    body: body.map((row) => row.map(pdfSafe)),
    startY: 56,
    margin: { left: 40, right: 40 },
    styles: { fontSize: 9, cellPadding: 5 },
    // DESIGN.md primary (#1f3a5f) with white text.
    headStyles: { fillColor: [31, 58, 95], textColor: 255 },
  })
  doc.save(fileName)
}
