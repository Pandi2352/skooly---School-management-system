import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_STUDENT_SORT, STUDENT_PAGE_SIZE } from '../constants'
import type { StudentFilters, StudentView } from '../types/student.types'
import {
  isPageSize,
  isSiblingFilter,
  isStatusFilter,
  isStudentSort,
  isStudentView,
} from '../utils/studentStatus'

type FilterChanges = Partial<StudentFilters>

// Short, readable URL names: /students?class=5&section=A&status=pending&size=25
const PARAM_NAMES: Record<keyof StudentFilters, string> = {
  status: 'status',
  classGrade: 'class',
  section: 'section',
  siblings: 'siblings',
  search: 'search',
  sort: 'sort',
  page: 'page',
  pageSize: 'size',
}

const DEFAULTS: StudentFilters = {
  status: 'all',
  classGrade: null,
  section: null,
  siblings: 'all',
  search: '',
  sort: DEFAULT_STUDENT_SORT,
  page: 1,
  pageSize: STUDENT_PAGE_SIZE,
}

const positiveInteger = (value: string | null) => {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : null
}

/**
 * List filters and the list/grid view live in the URL, so they survive a reload and can be
 * shared as a link. Default values are left out of the URL.
 */
export function useStudentFilters() {
  const [params, setParams] = useSearchParams()

  const status = params.get('status') ?? ''
  const siblings = params.get('siblings') ?? ''
  const sort = params.get('sort') ?? ''
  const view = params.get('view') ?? ''
  const classGrade = positiveInteger(params.get('class'))
  const pageSize = positiveInteger(params.get('size'))

  const filters: StudentFilters = {
    status: isStatusFilter(status) ? status : DEFAULTS.status,
    classGrade,
    // A section only means something inside a class.
    section: classGrade === null ? null : params.get('section'),
    siblings: isSiblingFilter(siblings) ? siblings : DEFAULTS.siblings,
    search: params.get('search') ?? DEFAULTS.search,
    sort: isStudentSort(sort) ? sort : DEFAULTS.sort,
    page: positiveInteger(params.get('page')) ?? DEFAULTS.page,
    pageSize: pageSize !== null && isPageSize(pageSize) ? pageSize : DEFAULTS.pageSize,
  }

  const update = useCallback(
    (changes: FilterChanges) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          for (const key of Object.keys(changes) as (keyof StudentFilters)[]) {
            const value = changes[key]
            const name = PARAM_NAMES[key]
            if (value === undefined || value === null || value === DEFAULTS[key]) next.delete(name)
            else next.set(name, String(value))
          }
          if ('classGrade' in changes && changes.classGrade === null) next.delete('section')
          // Any change except paging starts again from the first page.
          if (!('page' in changes)) next.delete('page')
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const setView = useCallback(
    (nextView: StudentView) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          if (nextView === 'list') next.delete('view')
          else next.set('view', nextView)
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  /** Clears every filter but keeps the chosen view and page size. */
  const reset = useCallback(() => {
    setParams(
      (current) => {
        const next = new URLSearchParams()
        for (const name of ['view', 'size']) {
          const value = current.get(name)
          if (value) next.set(name, value)
        }
        return next
      },
      { replace: true },
    )
  }, [setParams])

  const isFiltered =
    filters.status !== DEFAULTS.status ||
    filters.classGrade !== null ||
    filters.siblings !== DEFAULTS.siblings ||
    filters.search.trim() !== ''

  return {
    filters,
    view: isStudentView(view) ? view : 'list',
    update,
    setView,
    reset,
    isFiltered,
  }
}
