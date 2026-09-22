import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DEPARTMENTS, EMPLOYMENT_STATUSES } from '../constants'
import type { Department, EmploymentStatus } from '../constants'
import type { StaffFilters } from '../types/staff.types'

type FilterChanges = Partial<StaffFilters>

const PARAM_NAMES: Record<keyof StaffFilters, string> = {
  search: 'search',
  department: 'dept',
  status: 'status',
  page: 'page',
  limit: 'limit',
}

const DEFAULTS: StaffFilters = {
  search: '',
  department: '',
  status: '',
  page: 1,
  limit: 20,
}

const positiveInt = (v: string | null) => {
  const n = Number(v)
  return Number.isInteger(n) && n > 0 ? n : null
}

const isDepartment = (v: string): v is Department =>
  (DEPARTMENTS as readonly string[]).includes(v)

const isStatus = (v: string): v is EmploymentStatus =>
  (EMPLOYMENT_STATUSES as readonly string[]).includes(v)

export function useStaffFilters() {
  const [params, setParams] = useSearchParams()

  const dept = params.get('dept') ?? ''
  const status = params.get('status') ?? ''

  const filters: StaffFilters = {
    search: params.get('search') ?? DEFAULTS.search,
    department: isDepartment(dept) ? dept : DEFAULTS.department,
    status: isStatus(status) ? status : DEFAULTS.status,
    page: positiveInt(params.get('page')) ?? DEFAULTS.page,
    limit: positiveInt(params.get('limit')) ?? DEFAULTS.limit,
  }

  const update = useCallback(
    (changes: FilterChanges) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          for (const key of Object.keys(changes) as (keyof StaffFilters)[]) {
            const value = changes[key]
            const name = PARAM_NAMES[key]
            if (value === undefined || value === '' || value === DEFAULTS[key]) next.delete(name)
            else next.set(name, String(value))
          }
          if (!('page' in changes)) next.delete('page')
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const reset = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true })
  }, [setParams])

  const isFiltered = filters.search.trim() !== '' || filters.department !== '' || filters.status !== ''

  return { filters, update, reset, isFiltered }
}
