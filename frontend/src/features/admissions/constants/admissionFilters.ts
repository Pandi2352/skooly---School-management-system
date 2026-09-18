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
