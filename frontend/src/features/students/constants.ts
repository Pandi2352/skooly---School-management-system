export const ENROLLMENT_STATUSES = ['enrolled', 'pending', 'left'] as const
export const FEE_STATUSES = ['paid', 'due', 'overdue'] as const
export const SIBLING_FILTERS = ['all', 'with', 'without'] as const

export const STUDENT_SORT_FIELDS = [
  'admissionNo',
  'rollNo',
  'name',
  'class',
  'fatherName',
  'fatherPhone',
] as const
export const SORT_DIRECTIONS = ['asc', 'desc'] as const
export const STUDENT_SORTS = ['name-asc', 'name-desc', 'class-asc', 'admissionNo-desc'] as const
export const DEFAULT_STUDENT_SORT = 'name-asc'

export const STUDENT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

export const STUDENT_VIEWS = ['list', 'grid'] as const
