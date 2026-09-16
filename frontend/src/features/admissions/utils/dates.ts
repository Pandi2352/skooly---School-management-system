// Date inputs give "yyyy-mm-dd" strings in local time; these helpers never go through UTC.

const DATE_INPUT = /^\d{4}-\d{2}-\d{2}$/

const pad = (value: number) => String(value).padStart(2, '0')

export const toDateInputValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** The date, or null when the text isn't a real calendar date (such as 2026-02-30). */
export function parseDateInput(value: string): Date | null {
  if (!DATE_INPUT.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  if (year === undefined || month === undefined || day === undefined) return null
  const date = new Date(year, month - 1, day)
  return date.getMonth() === month - 1 && date.getDate() === day ? date : null
}

export const isValidDateInput = (value: string) => parseDateInput(value) !== null

/** True for dates before today. Invalid dates pass, so only the "enter a date" message shows. */
export function isPastDateInput(value: string, today = new Date()) {
  const date = parseDateInput(value)
  return date === null || toDateInputValue(date) < toDateInputValue(today)
}
