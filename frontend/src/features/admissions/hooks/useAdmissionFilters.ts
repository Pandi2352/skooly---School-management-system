import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AdmissionPipelineFilters } from '../api/admissionPipeline'
import {
  ADMISSION_DOCUMENT_FILTERS,
  ADMISSION_SORTS,
  ADMISSION_STATUS_FILTERS,
  DEFAULT_ADMISSION_PAGE_SIZE,
  type AdmissionDocumentFilter,
  type AdmissionSort,
} from '../constants/admissionFilters'

type AdmissionFilters = Required<Pick<AdmissionPipelineFilters, 'status' | 'search' | 'documents' | 'sort' | 'page' | 'limit'>> & {
  grade: number | undefined
  appliedFrom: string
  appliedTo: string
}

const DEFAULTS: AdmissionFilters = {
  status: 'all',
  search: '',
  grade: undefined,
  documents: 'all',
  appliedFrom: '',
  appliedTo: '',
  sort: 'newest',
  page: 1,
  limit: DEFAULT_ADMISSION_PAGE_SIZE,
}

const isOneOf = <T extends string>(values: readonly T[], value: string): value is T =>
  (values as readonly string[]).includes(value)

const gradeFrom = (value: string | null): number | undefined => {
  const grade = Number(value)
  return Number.isInteger(grade) && grade >= 1 && grade <= 12 ? grade : undefined
}

/**
 * Every filter lives in the URL, so a view can be reloaded, bookmarked or sent to a colleague —
 * "look at the pending documents for Grade 5" is a link, not a set of instructions.
 */
export function useAdmissionFilters() {
  const [params, setParams] = useSearchParams()

  const status = params.get('status') ?? ''
  const documents = params.get('documents') ?? ''
  const sort = params.get('sort') ?? ''
  const page = Number(params.get('page'))

  const filters: AdmissionFilters = useMemo(
    () => ({
      status: isOneOf(ADMISSION_STATUS_FILTERS, status) ? status : DEFAULTS.status,
      search: params.get('search') ?? DEFAULTS.search,
      grade: gradeFrom(params.get('grade')),
      documents: isOneOf(ADMISSION_DOCUMENT_FILTERS, documents) ? documents : DEFAULTS.documents,
      appliedFrom: params.get('from') ?? DEFAULTS.appliedFrom,
      appliedTo: params.get('to') ?? DEFAULTS.appliedTo,
      sort: isOneOf(ADMISSION_SORTS, sort) ? sort : DEFAULTS.sort,
      page: Number.isInteger(page) && page > 0 ? page : DEFAULTS.page,
      limit: DEFAULTS.limit,
    }),
    [params, status, documents, sort, page],
  )

  const update = useCallback(
    (changes: Partial<AdmissionFilters>) => {
      // Built from the URL as it is at the moment of the change, not from a render-time copy:
      // typing quickly in the search box fires several updates before React re-renders, and a
      // stale copy would drop every keystroke but the last.
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          const apply = (key: string, value: string | undefined, fallback: string) => {
            if (value === undefined) return
            if (value === '' || value === fallback) next.delete(key)
            else next.set(key, value)
          }

          apply('status', changes.status, DEFAULTS.status)
          apply('search', changes.search, '')
          apply('documents', changes.documents, DEFAULTS.documents)
          apply('sort', changes.sort, DEFAULTS.sort)
          apply('from', changes.appliedFrom, '')
          apply('to', changes.appliedTo, '')
          if ('grade' in changes) {
            if (changes.grade === undefined) next.delete('grade')
            else next.set('grade', String(changes.grade))
          }

          // Any change other than the page itself starts again at page one.
          if (changes.page === undefined) next.delete('page')
          else if (changes.page === DEFAULTS.page) next.delete('page')
          else next.set('page', String(changes.page))

          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams])

  const isFiltered =
    filters.status !== DEFAULTS.status ||
    filters.search !== '' ||
    filters.grade !== undefined ||
    filters.documents !== DEFAULTS.documents ||
    filters.appliedFrom !== '' ||
    filters.appliedTo !== ''

  return { filters, update, reset, isFiltered }
}

export type { AdmissionFilters, AdmissionDocumentFilter, AdmissionSort }
