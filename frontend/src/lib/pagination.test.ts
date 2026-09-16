import { describe, expect, it } from 'vitest'
import { getPageList } from './pagination'

describe('getPageList', () => {
  it('shows gaps on both sides in the middle', () => {
    expect(getPageList(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10])
  })

  it('shows the number instead of a one-page gap', () => {
    expect(getPageList(3, 10)).toEqual([1, 2, 3, 4, 'gap', 10])
  })

  it('handles small page counts', () => {
    expect(getPageList(1, 1)).toEqual([1])
    expect(getPageList(1, 3)).toEqual([1, 2, 3])
    expect(getPageList(1, 0)).toEqual([])
  })

  it('clamps a page outside the range', () => {
    expect(getPageList(99, 5)).toEqual([1, 'gap', 4, 5])
  })
})
