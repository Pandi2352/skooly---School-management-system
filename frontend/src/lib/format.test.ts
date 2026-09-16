import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatMoney, formatNumber } from './format'

describe('format', () => {
  it('formats rupees with Indian digit grouping', () => {
    expect(formatCurrency(123456)).toBe('₹1,23,456.00')
  })

  it('formats integer paise as rupees', () => {
    expect(formatMoney(12345600)).toBe('₹1,23,456.00')
  })

  it('refuses fractional minor units', () => {
    expect(() => formatMoney(10.5)).toThrow('integer minor units')
  })

  it('groups numbers the Indian way', () => {
    expect(formatNumber(1234567)).toBe('12,34,567')
  })

  it('shows dates in India time', () => {
    // 20:00 UTC on the 13th is 01:30 on the 14th in Asia/Kolkata.
    const formatted = formatDate('2026-09-13T20:00:00Z')
    expect(formatted).toMatch(/14/)
    expect(formatted).toMatch(/2026/)
  })

  it('throws on an invalid date instead of printing "Invalid Date"', () => {
    expect(() => formatDate('not a date')).toThrow('Invalid date')
  })
})
