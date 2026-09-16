import { DATE_FORMATS, SESSION_FORMATS } from '../constants'
import type { DatedSequence, DateFormat, Sequence, SessionFormat } from '../types/settings.types'

const separatorChars: Record<Sequence['separator'], string> = {
  slash: '/',
  dash: '-',
  dot: '.',
  none: '',
}

const twoDigits = (value: number) => String(value % 100).padStart(2, '0')

/** Academic sessions start in April, so January to March belong to the session that began last year. */
export const academicSessionStartYear = (date: Date) =>
  date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1

export function formatSession(format: SessionFormat, date: Date) {
  const start = academicSessionStartYear(date)
  return format === 'full' ? `${start}-${start + 1}` : `${twoDigits(start)}-${twoDigits(start + 1)}`
}

export function formatDatePart(format: DateFormat, date: Date) {
  const year = date.getFullYear()
  switch (format) {
    case 'yy':
      return twoDigits(year)
    case 'yyyy':
      return String(year)
    case 'monyy':
      return `${date.toLocaleString('en', { month: 'short' }).toUpperCase()}${twoDigits(year)}`
    case 'mmyy':
      return `${String(date.getMonth() + 1).padStart(2, '0')}${twoDigits(year)}`
  }
}

export type SequencePreviewInput = Sequence &
  Partial<Pick<DatedSequence, 'includeDate' | 'dateFormat' | 'nextNumber'>>

/**
 * The number a sequence produces on `date`, e.g. SPS/2026-2027/26/001. A missing or invalid
 * counter (such as a half-typed field) shows as 1.
 */
export function formatSequenceNumber(sequence: SequencePreviewInput, date: Date) {
  const counter =
    sequence.nextNumber !== undefined &&
    Number.isInteger(sequence.nextNumber) &&
    sequence.nextNumber > 0
      ? sequence.nextNumber
      : 1

  return [
    sequence.prefix.trim(),
    sequence.includeSession ? formatSession(sequence.sessionFormat, date) : '',
    sequence.includeDate && sequence.dateFormat ? formatDatePart(sequence.dateFormat, date) : '',
    String(counter).padStart(Number(sequence.padding), '0'),
  ]
    .filter((part) => part !== '')
    .join(separatorChars[sequence.separator])
}

const dateFormatNames: Record<DateFormat, string> = {
  yy: 'Year, 2 digits',
  yyyy: 'Year, 4 digits',
  monyy: 'Month + year',
  mmyy: 'Month number + year',
}

/** Select options labelled with today's example, e.g. "Full (2026-2027)". */
export const sessionFormatOptions = (date: Date) =>
  SESSION_FORMATS.map((format) => ({
    value: format,
    label: `${format === 'full' ? 'Full' : 'Short'} (${formatSession(format, date)})`,
  }))

export const dateFormatOptions = (date: Date) =>
  DATE_FORMATS.map((format) => ({
    value: format,
    label: `${formatDatePart(format, date)} (${dateFormatNames[format]})`,
  }))
