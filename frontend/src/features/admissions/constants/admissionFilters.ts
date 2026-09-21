/**
 * "All grades" uses a real value, not an empty string: Radix keeps "" for "nothing selected", so an
 * option with that value can never be shown and the field looks blank.
 */
export const ALL_GRADES = 'all'

export const GRADE_FILTER_OPTIONS = [
  { value: ALL_GRADES, label: 'All grades' },
  ...Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: `Grade ${index + 1}`,
  })),
]

/** The pipeline stages, plus "all". These match the statuses the API stores. */
export const ADMISSION_STATUS_FILTERS = ['all', 'under-review', 'approved', 'enrolled', 'rejected'] as const
export type AdmissionStatusFilter = (typeof ADMISSION_STATUS_FILTERS)[number]

export const ADMISSION_STATUS_LABELS: Record<AdmissionStatusFilter, string> = {
  all: 'Every status',
  'under-review': 'Under review',
  approved: 'Approved',
  enrolled: 'Enrolled',
  rejected: 'Rejected',
}

/** Whether every document an applicant sent has been checked. */
export const ADMISSION_DOCUMENT_FILTERS = ['all', 'verified', 'pending'] as const
export type AdmissionDocumentFilter = (typeof ADMISSION_DOCUMENT_FILTERS)[number]

export const ADMISSION_DOCUMENT_LABELS: Record<AdmissionDocumentFilter, string> = {
  all: 'Any documents',
  verified: 'All documents verified',
  pending: 'Documents still pending',
}

export const ADMISSION_SORTS = ['newest', 'oldest', 'name', 'grade'] as const
export type AdmissionSort = (typeof ADMISSION_SORTS)[number]

export const ADMISSION_SORT_LABELS: Record<AdmissionSort, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  name: 'Applicant name',
  grade: 'Grade applied for',
}

export const DEFAULT_ADMISSION_PAGE_SIZE = 20
