import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('keeps a text size and a text colour token together', () => {
    expect(cn('text-sm', 'text-ink')).toBe('text-sm text-ink')
  })

  it('lets the later colour token win', () => {
    expect(cn('bg-canvas', 'bg-surface')).toBe('bg-surface')
  })

  it('resolves the layout spacing tokens', () => {
    expect(cn('w-sidebar', 'w-sidebar-collapsed')).toBe('w-sidebar-collapsed')
  })

  it('drops falsy values', () => {
    expect(cn('px-3', false, undefined, 'py-2')).toBe('px-3 py-2')
  })
})
