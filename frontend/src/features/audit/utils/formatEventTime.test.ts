import { describe, expect, it } from 'vitest'
import { formatEventTime } from './formatEventTime'

describe('formatEventTime', () => {
  const now = new Date('2026-09-18T12:00:00.000Z')

  it('gives both readings of the same moment', () => {
    const result = formatEventTime('2026-09-18T11:45:00.000Z', now)
    expect(result.relative).toBe('15 minutes ago')
    expect(result.absolute).toBe(new Date('2026-09-18T11:45:00.000Z').toLocaleString())
  })

  it('counts in minutes, hours and days, then falls back to a date', () => {
    expect(formatEventTime('2026-09-18T11:59:30.000Z', now).relative).toBe('Just now')
    expect(formatEventTime('2026-09-18T11:59:00.000Z', now).relative).toBe('1 minute ago')
    expect(formatEventTime('2026-09-18T09:00:00.000Z', now).relative).toBe('3 hours ago')
    expect(formatEventTime('2026-09-16T12:00:00.000Z', now).relative).toBe('2 days ago')
    expect(formatEventTime('2026-08-01T12:00:00.000Z', now).relative).toBe(
      new Date('2026-08-01T12:00:00.000Z').toLocaleDateString(),
    )
  })
})
