import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Checkbox } from './Checkbox'
import {
  ACTIONS_COLUMN_KEY,
  selectionHandles,
  type TableColumn,
  type TableSelection,
} from './tableTypes'

type TableRecordListProps<T> = {
  caption: string
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  /** The column that names the row; the rest become labelled lines under it. */
  primaryKey: string
  /** Loading, error or empty. Replaces the list when set. */
  status: ReactNode
  selection?: TableSelection<T>
}

/**
 * The same rows on a phone, where a ten-column table is a sideways drag through a five-column
 * window. Each record becomes a block: the naming field as its heading, every other column as a
 * label and its value, so a number never appears without the name of the column it came from.
 */
export function TableRecordList<T>({
  caption,
  columns,
  rows,
  getRowKey,
  primaryKey,
  status,
  selection,
}: TableRecordListProps<T>) {
  const subject = caption.toLowerCase()
  const { allSelected, someSelected, toggleAll, toggleRow } = selectionHandles(
    rows,
    getRowKey,
    selection,
  )

  const primary = columns.find((column) => column.key === primaryKey) ?? columns[0]
  const actions = columns.find((column) => column.key === ACTIONS_COLUMN_KEY)
  const details = columns.filter(
    (column) => column.key !== primary?.key && column.key !== ACTIONS_COLUMN_KEY,
  )

  if (status) return <div>{status}</div>

  return (
    <div>
      {selection && (
        <div className="flex min-h-11 items-center gap-3 border-b border-line px-4">
          <Checkbox
            label={`Select all ${subject} on this page`}
            checked={allSelected ? true : someSelected ? 'indeterminate' : false}
            onCheckedChange={toggleAll}
          />
        </div>
      )}

      <ul>
        {rows.map((row) => {
          const key = getRowKey(row)
          const isSelected = selection?.selectedKeys.has(key) ?? false
          return (
            <li
              key={key}
              aria-selected={selection ? isSelected : undefined}
              className={cn(
                // The same left edge the table uses for a ticked row, so the mark means one thing.
                'grid gap-2 border-s-2 border-t border-line px-4 py-3 first:border-t-0',
                isSelected ? 'border-s-primary bg-primary/10' : 'border-s-transparent',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  {selection && (
                    <Checkbox
                      label={`Select ${selection.getRowLabel(row)}`}
                      hideLabel
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(key)}
                    />
                  )}
                  {primary && <div className="min-w-0 font-semibold text-ink">{primary.cell(row)}</div>}
                </div>
                {actions?.cell(row)}
              </div>

              {details.length > 0 && (
                <dl className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
                  {details.map((column) => (
                    <div key={column.key} className="col-span-2 grid grid-cols-subgrid items-baseline">
                      <dt className="text-ink-muted">{column.header}</dt>
                      <dd className="min-w-0 text-ink">{column.cell(row)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
