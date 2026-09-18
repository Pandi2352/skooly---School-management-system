import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { UserListQuery } from '../api/users'
import { DEFAULT_USERS_PAGE_SIZE, USER_SORT_FIELDS, USER_STATUSES, type UserSortField, type UserStatus } from '../constants'

const DEFAULTS: UserListQuery = {
  search: '',
  status: 'all',
  roleId: 'all',
  page: 1,
  limit: DEFAULT_USERS_PAGE_SIZE,
  sortBy: 'fullName',
  sortOrder: 'asc',
}

const isStatus = (value: string): value is UserStatus => (USER_STATUSES as readonly string[]).includes(value)
const isSortField = (value: string): value is UserSortField => (USER_SORT_FIELDS as readonly string[]).includes(value)

const positiveInteger = (value: string | null, fallback: number) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

/**
 * The search, filters and page live in the URL, so a reload keeps them and a link can be shared
 * with a colleague. Values that equal the default are left out, keeping the URL readable.
 */
export function useUserFilters() {
  const [params, setParams] = useSearchParams()

  const status = params.get('status') ?? ''
  const sortBy = params.get('sort') ?? ''
  const sortOrder = params.get('order') ?? ''

  const query: UserListQuery = {
    search: params.get('search') ?? DEFAULTS.search,
    status: isStatus(status) ? status : DEFAULTS.status,
    roleId: params.get('role') ?? DEFAULTS.roleId,
    page: positiveInteger(params.get('page'), DEFAULTS.page),
    limit: DEFAULTS.limit,
    sortBy: isSortField(sortBy) ? sortBy : DEFAULTS.sortBy,
    sortOrder: sortOrder === 'desc' ? 'desc' : DEFAULTS.sortOrder,
  }

  const update = useCallback(
    (changes: Partial<UserListQuery>) => {
      const next = { ...query, ...changes }
      // Any change other than the page itself starts again at page one, or a filter could leave
      // the reader on a page that no longer exists.
      if (changes.page === undefined) next.page = 1

      const search = new URLSearchParams()
      if (next.search) search.set('search', next.search)
      if (next.status !== DEFAULTS.status) search.set('status', next.status)
      if (next.roleId !== DEFAULTS.roleId) search.set('role', next.roleId)
      if (next.page !== DEFAULTS.page) search.set('page', String(next.page))
      if (next.sortBy !== DEFAULTS.sortBy) search.set('sort', next.sortBy)
      if (next.sortOrder !== DEFAULTS.sortOrder) search.set('order', next.sortOrder)
      setParams(search, { replace: true })
    },
    [query, setParams],
  )

  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams])

  const isFiltered = query.search !== '' || query.status !== 'all' || query.roleId !== 'all'

  return { query, update, reset, isFiltered }
}
