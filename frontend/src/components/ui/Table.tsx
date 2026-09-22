import { ArrowsDownUpIcon, CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { Checkbox } from './Checkbox'
import { TableRecordList } from './TableRecordList'
import { alignClass, selectionHandles, type TableColumn, type TableSelection, type TableSort } from './tableTypes'

export type { TableColumn, TableSelection, TableSort } from './tableTypes'

/**
 * Below Tailwind's `sm`, where a wide table is a sideways drag. Written as a max-width query on
 * purpose: a test environment answers false to every query, so tests keep the table.
 */
const PHONE_QUERY = '(max-width: 39.9375rem)'

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
  /**
   * The column that names a row on a phone, where the rest become labelled lines under it.
   * Defaults to the first column, which is right only when the first column is the naming one.
   */
  primaryKey?: string
}

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
  primaryKey,
}: TableProps<T>) {
  const isPhone = useMediaQuery(PHONE_QUERY)
  const subject = caption.toLowerCase()
  let status: ReactNode = null
  if (isLoading) status = <LoadingState label={`Loading ${subject}`} />
  else if (error)
    status = <ErrorState title={`Couldn't load ${subject}`} description={error} onRetry={onRetry} />
  else if (rows.length === 0) status = empty

  const { rowKeys, allSelected, someSelected, toggleAll, toggleRow } = selectionHandles(
    rows,
    getRowKey,
    selection,
  )
  const columnCount = columns.length + (selection ? 1 : 0)

  const heading = hideCaption ? null : (
    <p className="px-4 pt-3 pb-2 font-semibold text-ink">{caption}</p>
  )

  if (isPhone) {
    return (
      <div className={cn('bg-surface', bordered && 'rounded-md border border-line')}>
        {heading}
        <TableRecordList
          caption={caption}
          columns={columns}
          rows={rows}
          getRowKey={getRowKey}
          primaryKey={primaryKey ?? columns[0]?.key ?? ''}
          status={status}
          selection={selection}
        />
      </div>
    )
  }

  return (
    // A wide table scrolls inside this box, so the page itself never scrolls sideways.
    <div
      className={cn(
        'overflow-x-auto bg-surface print:overflow-visible',
        bordered && 'rounded-md border border-line',
      )}
    >
      {/*
        Separate borders, not collapsed: a collapsed border does not paint on a sticky header, and
        the header has to stay readable while a long list scrolls under it.
      */}
      <table className="w-full border-separate border-spacing-0 text-sm">
        <caption className={hideCaption ? 'sr-only' : 'px-4 pt-3 pb-2 text-start font-semibold'}>
          {caption}
        </caption>
        <thead>
          <tr>
            {selection && (
              <th
                scope="col"
                className="sticky top-0 z-10 w-11 border-b border-line bg-table-head ps-4 pe-2 py-2 print:hidden"
              >
                <Checkbox
                  label={`Select all ${subject} on this page`}
                  hideLabel
                  disabled={rowKeys.length === 0 || status !== null}
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
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
                    // Quiet by default so the rows lead; the sorted column darkens to say which
                    // one is ordering the list. 6.0:1 muted and 14:1 sorted on the header colour.
                    'sticky top-0 z-10 border-b border-line bg-table-head px-3 py-2 text-xs font-semibold whitespace-nowrap',
                    'first:ps-4 last:pe-4',
                    isSorted ? 'text-ink' : 'text-ink-muted',
                    alignClass(column.align),
                  )}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(column.key)}
                      className={cn(
                        '-mx-2 inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm px-2 hover:bg-primary/10 pointer-coarse:min-h-11',
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
        {/* The header already draws the rule above the first row. */}
        <tbody className="[&>tr:first-child>*]:border-t-0">
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
                    // focus-within, so tabbing through a row menu shows which row is in hand.
                    isSelected ? 'bg-primary/10' : 'hover:bg-primary/5 focus-within:bg-primary/5',
                  )}
                >
                  {selection && (
                    <td
                      className={cn(
                        'border-t border-s-2 border-line ps-4 pe-2 py-1.5 print:hidden',
                        isSelected ? 'border-s-primary' : 'border-s-transparent',
                      )}
                    >
                      <Checkbox
                        label={`Select ${selection.getRowLabel(row)}`}
                        hideLabel
                        checked={isSelected}
                        onCheckedChange={() => toggleRow(key)}
                      />
                    </td>
                  )}
                  {columns.map((column, index) => (
                    <td
                      key={column.key}
                      className={cn(
                        'border-t border-line px-3 py-2 last:pe-4',
                        // A ticked row carries a left edge in the theme colour. The transparent
                        // edge on every other row keeps the text from shifting when it appears.
                        index === 0 && !selection && 'border-s-2 ps-4',
                        index === 0 &&
                          !selection &&
                          (isSelected ? 'border-s-primary' : 'border-s-transparent'),
                        alignClass(column.align),
                      )}
                    >
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
