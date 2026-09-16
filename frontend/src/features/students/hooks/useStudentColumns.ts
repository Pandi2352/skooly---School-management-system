import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { isStudentColumnKey, STUDENT_COLUMNS, type StudentColumnKey } from '../utils/studentColumns'

const isColumnKeyList = (value: unknown): value is StudentColumnKey[] =>
  Array.isArray(value) &&
  value.every((key: unknown) => typeof key === 'string' && isStudentColumnKey(key))

/** Which list columns are hidden, remembered in this browser. */
export function useStudentColumns() {
  const [hiddenKeys, setHiddenKeys] = useLocalStorage<StudentColumnKey[]>(
    STORAGE_KEYS.studentHiddenColumns,
    [],
    isColumnKeyList,
  )

  const visibleKeys = STUDENT_COLUMNS.filter(
    (column) => !column.hideable || !hiddenKeys.includes(column.key),
  ).map((column) => column.key)

  const toggle = (key: StudentColumnKey) => {
    setHiddenKeys(
      hiddenKeys.includes(key)
        ? hiddenKeys.filter((hidden) => hidden !== key)
        : [...hiddenKeys, key],
    )
  }

  return {
    visibleKeys,
    isVisible: (key: StudentColumnKey) => visibleKeys.includes(key),
    toggle,
    showAll: () => setHiddenKeys([]),
  }
}
