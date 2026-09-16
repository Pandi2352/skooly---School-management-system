import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useStudentFilters } from './useStudentFilters'

const renderAt = (url: string) =>
  renderHook(() => useStudentFilters(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    ),
  })

describe('useStudentFilters', () => {
  it('reads filters from the URL and ignores invalid values', () => {
    const { result } = renderAt(
      '/students?status=pending&sort=bogus&page=3&search=asha&class=5&section=A&size=7&view=cards',
    )
    expect(result.current.filters).toMatchObject({
      status: 'pending',
      sort: 'name-asc',
      page: 3,
      search: 'asha',
      classGrade: 5,
      section: 'A',
      pageSize: 10,
    })
    expect(result.current.view).toBe('list')
    expect(result.current.isFiltered).toBe(true)
  })

  it('ignores a section without a class', () => {
    const { result } = renderAt('/students?section=A')
    expect(result.current.filters.section).toBeNull()
    expect(result.current.isFiltered).toBe(false)
  })

  it('returns to page 1 when a filter changes', () => {
    const { result } = renderAt('/students?page=3')
    act(() => {
      result.current.update({ status: 'left' })
    })
    expect(result.current.filters).toMatchObject({ status: 'left', page: 1 })
  })

  it('keeps the page when only the page changes', () => {
    const { result } = renderAt('/students?status=enrolled')
    act(() => {
      result.current.update({ page: 2 })
    })
    expect(result.current.filters).toMatchObject({ status: 'enrolled', page: 2 })
  })

  it('clears the section when the class is cleared', () => {
    const { result } = renderAt('/students?class=5&section=B')
    act(() => {
      result.current.update({ classGrade: null })
    })
    expect(result.current.filters).toMatchObject({ classGrade: null, section: null })
  })

  it('resets filters but keeps the view and page size', () => {
    const { result } = renderAt('/students?status=left&class=2&view=grid&size=25&search=x')
    act(() => {
      result.current.reset()
    })
    expect(result.current.filters).toMatchObject({
      status: 'all',
      classGrade: null,
      search: '',
      pageSize: 25,
    })
    expect(result.current.view).toBe('grid')
  })
})
