import { describe, expect, it } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it.each([
    ['Fees & Finance', 'fees-and-finance'],
    ['Hostel / Dormitory', 'hostel-dormitory'],
    ['E-Learning', 'e-learning'],
    ['Bulk CSV/Excel Import', 'bulk-csv-excel-import'],
  ])('%s → %s', (label, slug) => {
    expect(slugify(label)).toBe(slug)
  })
})
