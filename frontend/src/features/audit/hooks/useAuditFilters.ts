import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AuditListQuery } from '../api/audit'
import {
  AUDIT_ACTIONS,
  AUDIT_PERIODS,
  DEFAULT_AUDIT_PAGE_SIZE,
  type AuditAction,
  type AuditPeriod,
} from '../constants'

const DEFAULTS: AuditListQuery = {
  search: '',
  action: 'all',
  period: 'week',
  page: 1,
  limit: DEFAULT_AUDIT_PAGE_SIZE,
}

const isAction = (value: string): value is AuditAction => (AUDIT_ACTIONS as readonly string[]).includes(value)
const isPeriod = (value: string): value is AuditPeriod => (AUDIT_PERIODS as readonly string[]).includes(value)

/**
 * The filters live in the URL, so a reload keeps them and "look at this" can be sent as a link —
 * which is most of what an audit trail is for.
 */
export function useAuditFilters() {
  const [params, setParams] = useSearchParams()

  const action = params.get('action') ?? ''
  const period = params.get('period') ?? ''
  const page = Number(params.get('page'))

  const query: AuditListQuery = useMemo(() => ({
    search: params.get('search') ?? DEFAULTS.search,
    action: isAction(action) ? action : DEFAULTS.action,
    period: isPeriod(period) ? period : DEFAULTS.period,
    page: Number.isInteger(page) && page > 0 ? page : DEFAULTS.page,
    limit: DEFAULTS.limit,
  }), [params, action, period, page])

  const update = useCallback(
    (changes: Partial<AuditListQuery>) => {
      const next = { ...query, ...changes }
      // Any change other than the page itself starts again at page one.
      if (changes.page === undefined) next.page = 1

      const search = new URLSearchParams()
      if (next.search) search.set('search', next.search)
      if (next.action !== DEFAULTS.action) search.set('action', next.action)
      if (next.period !== DEFAULTS.period) search.set('period', next.period)
      if (next.page !== DEFAULTS.page) search.set('page', String(next.page))
      setParams(search, { replace: true })
    },
    [query, setParams],
  )

  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams])

  const isFiltered = query.search !== '' || query.action !== 'all' || query.period !== DEFAULTS.period

  return { query, update, reset, isFiltered }
}
