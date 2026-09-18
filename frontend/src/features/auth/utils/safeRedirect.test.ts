import { describe, expect, it } from 'vitest'
import { safeRedirect } from './safeRedirect'

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
    expect(safeRedirect('/\evil.example', '/dashboard')).toBe('/dashboard')
    expect(safeRedirect('/users\..\..', '/dashboard')).toBe('/dashboard')
    expect(safeRedirect('javascript:alert(1)', '/dashboard')).toBe('/dashboard')
    expect(safeRedirect('/javascript:alert(1)', '/dashboard')).toBe('/dashboard')
  })
})
