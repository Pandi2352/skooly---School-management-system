import type { FeeGroup } from '../types/admission.types'

export function filterFeeGroups(groups: FeeGroup[], query: string) {
  const text = query.trim().toLowerCase()
  return text === '' ? groups : groups.filter((group) => group.name.toLowerCase().includes(text))
}

export const toggleId = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id]

/** Adds ids without duplicates, keeping the existing order first. */
export const addIds = (ids: string[], more: string[]) => [...new Set([...ids, ...more])]

export const removeIds = (ids: string[], less: string[]) => ids.filter((id) => !less.includes(id))
