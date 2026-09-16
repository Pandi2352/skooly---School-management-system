import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { TemplateCategory, TemplateFilters } from '../types/template.types'
import { isTemplateCategory } from '../utils/guards'

/**
 * Gallery search and category live in the URL (?search=id&category=certificate).
 * A page can lock the category, e.g. Card Designs shows ID cards only.
 */
export function useTemplateFilters(lockedCategory?: TemplateCategory) {
  const [params, setParams] = useSearchParams()
  const categoryParam = params.get('category') ?? ''

  const filters: TemplateFilters = {
    search: params.get('search') ?? '',
    category: lockedCategory ?? (isTemplateCategory(categoryParam) ? categoryParam : 'all'),
  }

  const setParam = useCallback(
    (name: string, value: string) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          if (value === '' || value === 'all') next.delete(name)
          else next.set(name, value)
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const clear = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true })
  }, [setParams])

  return {
    filters,
    isFiltered:
      filters.search.trim() !== '' || (lockedCategory === undefined && filters.category !== 'all'),
    setSearch: (search: string) => setParam('search', search),
    setCategory: (category: TemplateCategory | 'all') => setParam('category', category),
    clear,
  }
}
