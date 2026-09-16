import { describe, expect, it } from 'vitest'
import { getInitials } from './getInitials'

describe('getInitials', () => {
  it.each([
    ['Super Admin', 'SA'],
    ['  priya  ', 'P'],
    ['Anand Kumar Rao', 'AR'],
    ['', ''],
  ])('%j → %j', (name, initials) => {
    expect(getInitials(name)).toBe(initials)
  })
})
