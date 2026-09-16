import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { formatNumber } from '@/lib/format'
import { getPageList } from '@/lib/pagination'
import { Button } from './Button'
import { Select } from './Select'

type PaginationProps = {
  page: number
  pageCount: number
  /** Items across all pages. */
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  /** Shows a rows-per-page picker when provided. */
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: readonly number[]
  /** Plural noun for the summary: "Showing 1 to 10 of 26 students". */
  itemLabel?: string
}

/** Shared footer for every paginated list: summary, rows per page and page buttons. */
export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  itemLabel = 'items',
}: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 print:hidden"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
        <p aria-live="polite">
          {total === 0
            ? `No ${itemLabel}`
            : `Showing ${formatNumber(from)} to ${formatNumber(to)} of ${formatNumber(total)} ${itemLabel}`}
        </p>
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span aria-hidden="true">Rows per page</span>
            <div className="w-24">
              <Select
                label="Rows per page"
                hideLabel
                options={pageSizeOptions.map((size) => ({
                  value: String(size),
                  label: String(size),
                }))}
                value={String(pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              />
            </div>
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <ul className="flex flex-wrap items-center gap-1">
          <li>
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              aria-label="Previous page"
              onClick={() => onPageChange(page - 1)}
            >
              <CaretLeftIcon className="size-4" aria-hidden="true" />
              <span className="max-sm:hidden">Previous</span>
            </Button>
          </li>
          {getPageList(page, pageCount).map((item, index) =>
            item === 'gap' ? (
              <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-ink-muted">
                …
              </li>
            ) : (
              <li key={item}>
                <Button
                  variant={item === page ? 'primary' : 'ghost'}
                  size="sm"
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? 'page' : undefined}
                  className="min-w-9"
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </Button>
              </li>
            ),
          )}
          <li>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= pageCount}
              aria-label="Next page"
              onClick={() => onPageChange(page + 1)}
            >
              <span className="max-sm:hidden">Next</span>
              <CaretRightIcon className="size-4" aria-hidden="true" />
            </Button>
          </li>
        </ul>
      )}
    </nav>
  )
}
