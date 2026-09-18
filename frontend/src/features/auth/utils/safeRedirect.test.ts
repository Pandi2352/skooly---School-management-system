import { describe, expect, it } from 'vitest'
import { safeRedirect } from './safeRedirect'

// Written as a constant so the test really contains a backslash: '\e' in a string literal is just
// 'e', which is how an earlier version of this test passed without testing anything.
const BACKSLASH = '\\'

describe('safeRedirect', () => {
  it('keeps an ordinary in-app path, query and all', () => {
    expect(safeRedirect('/users?status=invited', '/dashboard')).toBe('/users?status=invited')
  })

  it('falls back when nothing was asked for', () => {
    expect(safeRedirect(null, '/dashboard')).toBe('/dashboard')
    expect(safeRedirect('', '/dashboard')).toBe('/dashboard')
  })

  it('refuses to send anyone to another site', () => {
    expect(safeRedirect('https://evil.example/steal', '/dashboard')).toBe('/dashboard')
    expect(safeRedirect('//evil.example', '/dashboard')).toBe('/dashboard')
    expect(safeRedirect('javascript:alert(1)', '/dashboard')).toBe('/dashboard')
    expect(safeRedirect('/javascript:alert(1)', '/dashboard')).toBe('/dashboard')
  })

  it('refuses backslashes, which some browsers read as slashes', () => {
    expect(safeRedirect(`/${BACKSLASH}evil.example`, '/dashboard')).toBe('/dashboard')
    expect(safeRedirect(`${BACKSLASH}${BACKSLASH}evil.example`, '/dashboard')).toBe('/dashboard')
    expect(safeRedirect(`/users${BACKSLASH}..${BACKSLASH}..`, '/dashboard')).toBe('/dashboard')
  })
})
