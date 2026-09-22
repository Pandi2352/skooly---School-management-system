import {
  CaretDownIcon,
  ColumnsIcon,
  CopySimpleIcon,
  LockSimpleIcon,
  PrinterIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import {
  Dropdown,
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from '@/components/ui/Dropdown'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { Tooltip } from '@/components/ui/Tooltip'
import { STUDENT_COLUMNS, type StudentColumnKey } from '../utils/studentColumns'

type StudentRecordsToolbarProps = {
  pageSize: number
  pageSizeOptions: readonly number[]
  onPageSizeChange: (pageSize: number) => void
  /** Nothing to export while loading or when the page is empty. */
  canExport: boolean
  onCopy: () => void
  onDownloadCsv: () => void
  onDownloadExcel: () => void
  onDownloadPdf: () => void
  onPrint: () => void
  isColumnVisible: (key: StudentColumnKey) => boolean
  onToggleColumn: (key: StudentColumnKey) => void
  onShowAllColumns: () => void
  selectedCount: number
  onClearSelection: () => void
  onBulkEdit: () => void
  onBulkDelete: () => void
  search: string
  onSearchChange: (search: string) => void
}

// Layout follows the reference: Show [size] · copy · CSV · Excel · PDF · print · Columns · bulk
// actions, with search on the right. Exports and print cover the current page.
export function StudentRecordsToolbar({
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  canExport,
  onCopy,
  onDownloadCsv,
  onDownloadExcel,
  onDownloadPdf,
  onPrint,
  isColumnVisible,
  onToggleColumn,
  onShowAllColumns,
  selectedCount,
  onClearSelection,
  onBulkEdit,
  onBulkDelete,
  search,
  onSearchChange,
}: StudentRecordsToolbarProps) {
  const hasSelection = selectedCount > 0

  return (
    <>
      <div className="w-full sm:w-72">
        <SearchInput
          label="Search students"
          size="sm"
          placeholder="Search by name, admission no., roll no. or father"
          value={search}
          onValueChange={onSearchChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <span aria-hidden="true">Show</span>
          <div className="w-18">
            <Select
              label="Rows per page"
              hideLabel
              size="sm"
              options={pageSizeOptions.map((size) => ({
                value: String(size),
                label: String(size),
              }))}
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            />
          </div>
        </div>

        <Tooltip content="Copy this page">
          <Button
            variant="secondary"
            size="sm"
            className="w-8 px-0 pointer-coarse:w-11"
            aria-label="Copy this page"
            disabled={!canExport}
            onClick={onCopy}
          >
            <CopySimpleIcon className="size-4" aria-hidden="true" />
          </Button>
        </Tooltip>
        <Tooltip content="Download this page as CSV">
          <Button variant="secondary" size="sm" disabled={!canExport} onClick={onDownloadCsv}>
            CSV
          </Button>
        </Tooltip>
        <Tooltip content="Download this page as an Excel file">
          <Button variant="secondary" size="sm" disabled={!canExport} onClick={onDownloadExcel}>
            Excel
          </Button>
        </Tooltip>
        <Tooltip content="Download this page as a PDF">
          <Button variant="secondary" size="sm" disabled={!canExport} onClick={onDownloadPdf}>
            PDF
          </Button>
        </Tooltip>
        <Tooltip content="Print this page">
          <Button
            variant="secondary"
            size="sm"
            className="w-8 px-0 pointer-coarse:w-11"
            aria-label="Print this page"
            disabled={!canExport}
            onClick={onPrint}
          >
            <PrinterIcon className="size-4" aria-hidden="true" />
          </Button>
        </Tooltip>

        <Dropdown
          align="start"
          trigger={
            <Button variant="secondary" size="sm">
              <ColumnsIcon className="size-4" aria-hidden="true" />
              Columns
              <CaretDownIcon className="size-3.5" aria-hidden="true" />
            </Button>
          }
        >
          <DropdownLabel>Show columns</DropdownLabel>
          {STUDENT_COLUMNS.filter((column) => column.hideable).map((column) => (
            <DropdownCheckboxItem
              key={column.key}
              checked={isColumnVisible(column.key)}
              onCheckedChange={() => onToggleColumn(column.key)}
            >
              {column.label}
            </DropdownCheckboxItem>
          ))}
          <DropdownSeparator />
          <DropdownItem onSelect={onShowAllColumns}>Show all columns</DropdownItem>
        </Dropdown>

        {/* Disabled (with a lock) until rows are selected, like the reference. */}
        <Button variant="secondary" size="sm" disabled={!hasSelection} onClick={onBulkEdit}>
          <LockSimpleIcon className="size-4" aria-hidden="true" />
          Bulk Edit
        </Button>
        <Button variant="secondary" size="sm" disabled={!hasSelection} onClick={onBulkDelete}>
          <TrashIcon className="size-4" aria-hidden="true" />
          Bulk Delete
        </Button>

        {hasSelection && (
          <span className="flex items-center gap-1 text-sm">
            <span className="font-semibold" aria-live="polite">
              {selectedCount} selected
            </span>
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              Clear
            </Button>
          </span>
        )}
      </div>
    </>
  )
}
