import type { ReactNode } from 'react'

export type TableColumn<T> = {
  key: string
  header: string
  cell: (row: T) => ReactNode
  align?: 'start' | 'end'
  /** Shows a sort button in the header; `onSortChange` receives the column key. */
  sortable?: boolean
}

export type TableSort = { key: string; direction: 'asc' | 'desc' }

export type TableSelection<T> = {
  selectedKeys: ReadonlySet<string>
  onChange: (keys: Set<string>) => void
  /** Names the row for the checkbox label: "Select Sample Student 01". */
  getRowLabel: (row: T) => string
}

/** The row menu. Its cell is laid out apart from the data on a phone, where there is no column. */
export const ACTIONS_COLUMN_KEY = 'actions'

export const alignClass = (align: TableColumn<unknown>['align']) =>
  align === 'end' ? 'text-end' : 'text-start'

/** Tick and untick handling, shared by the table and the phone list so both behave the same. */
export function selectionHandles<T>(
  rows: T[],
  getRowKey: (row: T) => string,
  selection: TableSelection<T> | undefined,
) {
  const rowKeys = rows.map(getRowKey)
  const selectedOnPage = selection ? rowKeys.filter((key) => selection.selectedKeys.has(key)) : []
  const allSelected = rowKeys.length > 0 && selectedOnPage.length === rowKeys.length

  const toggleAll = () => {
    if (!selection) return
    const next = new Set(selection.selectedKeys)
    for (const key of rowKeys) {
      if (allSelected) next.delete(key)
      else next.add(key)
    }
    selection.onChange(next)
  }

  const toggleRow = (key: string) => {
    if (!selection) return
    const next = new Set(selection.selectedKeys)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    selection.onChange(next)
  }

  return {
    rowKeys,
    allSelected,
    someSelected: selectedOnPage.length > 0,
    toggleAll,
    toggleRow,
  }
}
