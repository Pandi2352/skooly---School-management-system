import { useCallback, useState } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'

/** useState that is saved as JSON. `isValid` rejects stale or hand-edited values. */
export function useLocalStorage<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    const raw = readStorage(key)
    if (raw === null) return fallback
    try {
      const parsed: unknown = JSON.parse(raw)
      return isValid(parsed) ? parsed : fallback
    } catch {
      return fallback
    }
  })

  const update = useCallback(
    (next: T) => {
      setValue(next)
      writeStorage(key, JSON.stringify(next))
    },
    [key],
  )

  return [value, update] as const
}
