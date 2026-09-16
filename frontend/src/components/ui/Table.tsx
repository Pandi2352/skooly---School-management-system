import { ArrowsDownUpIcon, CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { cn } from '@/lib/cn'
import { Checkbox } from './Checkbox'

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

type TableProps<T> = {
  /** Also used in the loading and error messages: "Loading students…". */
  caption: string
  hideCaption?: boolean
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  /** Shown when there are no rows: say why, and give the action that adds one. */
  empty: ReactNode
  /** Turn off when the table already sits inside a bordered card. */
  bordered?: boolean
  sort?: TableSort
  onSortChange?: (key: string) => void
  selection?: TableSelection<T>
}

const alignClass = (align: TableColumn<unknown>['align']) =>
  align === 'end' ? 'text-end' : 'text-start'

export function Table<T>({
  caption,
  hideCaption = false,
  columns,
  rows,
  getRowKey,
  isLoading = false,
  error,
  onRetry,
  empty,
  bordered = true,
  sort,
  onSortChange,
  selection,
}: TableProps<T>) {
  const subject = caption.toLowerCase()
  let status: ReactNode = null
  if (isLoading) status = <LoadingState label={`Loading ${subject}`} />
  else if (error)
    status = <ErrorState title={`Couldn't load ${subject}`} description={error} onRetry={onRetry} />
  else if (rows.length === 0) status = empty

  const rowKeys = rows.map(getRowKey)
  const selectedOnPage = selection ? rowKeys.filter((key) => selection.selectedKeys.has(key)) : []
  const allSelected = rowKeys.length > 0 && selectedOnPage.length === rowKeys.length
  const columnCount = columns.length + (selection ? 1 : 0)

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

  return (
    // Wide tables scroll inside this box, so the page itself never scrolls sideways.
    <div
      className={cn(
        'overflow-x-auto bg-surface print:overflow-visible',
        bordered && 'rounded-md border border-line',
      )}
    >
      <table className="w-full border-collapse text-sm">
        <caption className={hideCaption ? 'sr-only' : 'px-4 pt-3 pb-2 text-start font-semibold'}>
          {caption}
        </caption>
        <thead className="border-b border-line bg-table-head">
          <tr>
            {selection && (
              <th scope="col" className="w-11 px-3 py-1.5 print:hidden">
                <Checkbox
                  label={`Select all ${subject} on this page`}
                  hideLabel
                  disabled={rowKeys.length === 0 || status !== null}
                  checked={allSelected ? true : selectedOnPage.length > 0 ? 'indeterminate' : false}
                  onCheckedChange={toggleAll}
                />
              </th>
            )}
            {columns.map((column) => {
              const isSorted = sort?.key === column.key
              const SortIcon = !isSorted
                ? ArrowsDownUpIcon
                : sort.direction === 'asc'
                  ? CaretUpIcon
                  : CaretDownIcon
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    column.sortable
                      ? isSorted
                        ? sort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  className={cn(
                    // Theme primary: 10.6:1 on the header background in light, 9.4:1 in dark.
                    // Uppercase and bold at the owner's request (DESIGN.md, Tables).
                    'px-3 py-2.5 text-xs font-bold tracking-wide whitespace-nowrap text-primary uppercase',
                    alignClass(column.align),
                  )}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(column.key)}
                      className={cn(
                        '-mx-2 inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm px-2 hover:bg-primary/10 pointer-coarse:min-h-11',
                        // Headers stay in the theme colour; the sorted one gets a light tint.
                        isSorted && 'bg-primary/10',
                      )}
                    >
                      {column.header}
                      <SortIcon
                        className={cn('size-3.5', !isSorted && 'opacity-60')}
                        weight="bold"
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {status ? (
            <tr>
              <td colSpan={columnCount}>{status}</td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = getRowKey(row)
              const isSelected = selection?.selectedKeys.has(key) ?? false
              return (
                <tr
                  key={key}
                  aria-selected={selection ? isSelected : undefined}
                  className={cn(
                    'border-t border-line',
                    // Hover and selection use the theme colour; selected rows are a step stronger.
                    isSelected ? 'bg-primary/10' : 'hover:bg-primary/5',
                  )}
                >
                  {selection && (
                    <td className="px-3 py-1 print:hidden">
                      <Checkbox
                        label={`Select ${selection.getRowLabel(row)}`}
                        hideLabel
                        checked={isSelected}
                        onCheckedChange={() => toggleRow(key)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-3 py-2', alignClass(column.align))}>
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
