import { invariant } from './assert'

// FRONTEND.md D6.
const LOCALE = 'en-IN'
const TIME_ZONE = 'Asia/Kolkata'

const dateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeZone: TIME_ZONE })
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: TIME_ZONE,
})
const numberFormat = new Intl.NumberFormat(LOCALE)
const currencyFormats = new Map<string, Intl.NumberFormat>()

type DateInput = Date | string | number

function toDate(value: DateInput) {
  const date = value instanceof Date ? value : new Date(value)
  invariant(!Number.isNaN(date.getTime()), `Invalid date: ${String(value)}`)
  return date
}

export const formatDate = (value: DateInput) => dateFormat.format(toDate(value))

export const formatDateTime = (value: DateInput) => dateTimeFormat.format(toDate(value))

export const formatNumber = (value: number) => numberFormat.format(value)

/**
 * Money arrives as integer minor units (paise) so no floating-point maths touches it
 * (BLUEPRINT.md section 21). Convert only here, for display. Confirm the format with the API.
 */
export function formatMoney(minorUnits: number, currency = 'INR') {
  invariant(Number.isInteger(minorUnits), `Money must be integer minor units, got ${minorUnits}`)
  return formatCurrency(minorUnits / 100, currency)
}

/** Formats an amount already in major units (rupees). Prefer formatMoney for API amounts. */
export function formatCurrency(amount: number, currency = 'INR') {
  let format = currencyFormats.get(currency)
  if (!format) {
    format = new Intl.NumberFormat(LOCALE, { style: 'currency', currency })
    currencyFormats.set(currency, format)
  }
  return format.format(amount)
}
