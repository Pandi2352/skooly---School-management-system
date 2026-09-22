import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import {
  ADMISSION_DOCUMENT_FILTERS,
  ADMISSION_DOCUMENT_LABELS,
  ADMISSION_SORTS,
  ADMISSION_SORT_LABELS,
  ADMISSION_STATUS_FILTERS,
  ADMISSION_STATUS_LABELS,
  ALL_GRADES,
  GRADE_FILTER_OPTIONS,
} from '../constants/admissionFilters'
import type { AdmissionFilters } from '../hooks/useAdmissionFilters'

type AdmissionsToolbarProps = {
  filters: AdmissionFilters
  isFiltered: boolean
  onChange: (changes: Partial<AdmissionFilters>) => void
  onReset: () => void
}

/**
 * Search first, then the filters that narrow it, all on one height so the row reads as a single
 * strip. The date pair carries one label between them: two labels above two fields made the row
 * twice as tall as the controls beside it.
 */
export function AdmissionsToolbar({ filters, isFiltered, onChange, onReset }: AdmissionsToolbarProps) {
  return (
    <>
      <div className="w-full sm:w-64">
        <SearchInput
          label="Search applications by name, number or parent"
          size="sm"
          placeholder="Search name, app # or parent"
          value={filters.search}
          onValueChange={(search) => onChange({ search })}
        />
      </div>

      <div className="w-40">
        <Select
          label="Status"
          hideLabel
          size="sm"
          value={filters.status}
          onValueChange={(status) => onChange({ status })}
          options={ADMISSION_STATUS_FILTERS.map((status) => ({
            value: status,
            label: ADMISSION_STATUS_LABELS[status],
          }))}
        />
      </div>

      <div className="w-36">
        <Select
          label="Grade"
          hideLabel
          size="sm"
          value={filters.grade === undefined ? ALL_GRADES : String(filters.grade)}
          onValueChange={(value) => onChange({ grade: value === ALL_GRADES ? undefined : Number(value) })}
          options={GRADE_FILTER_OPTIONS}
        />
      </div>

      <div className="w-44">
        <Select
          label="Documents"
          hideLabel
          size="sm"
          value={filters.documents}
          onValueChange={(documents) => onChange({ documents: documents as AdmissionFilters['documents'] })}
          options={ADMISSION_DOCUMENT_FILTERS.map((value) => ({
            value,
            label: ADMISSION_DOCUMENT_LABELS[value],
          }))}
        />
      </div>

      <div className="w-40">
        <Select
          label="Sort by"
          hideLabel
          size="sm"
          value={filters.sort}
          onValueChange={(sort) => onChange({ sort: sort as AdmissionFilters['sort'] })}
          options={ADMISSION_SORTS.map((value) => ({ value, label: ADMISSION_SORT_LABELS[value] }))}
        />
      </div>

      {/* Applied between: two plain date fields beat a custom picker nobody can type into. */}
      <div className="flex items-center gap-1.5">
        <span className="text-[0.8125rem] text-ink-muted" aria-hidden="true">
          Applied
        </span>
        <div className="w-36">
          <Input
            label="Applied from"
            hideLabel
            size="sm"
            type="date"
            value={filters.appliedFrom}
            max={filters.appliedTo || undefined}
            onChange={(event) => onChange({ appliedFrom: event.target.value })}
          />
        </div>
        <span className="text-[0.8125rem] text-ink-muted" aria-hidden="true">
          to
        </span>
        <div className="w-36">
          <Input
            label="Applied to"
            hideLabel
            size="sm"
            type="date"
            value={filters.appliedTo}
            min={filters.appliedFrom || undefined}
            onChange={(event) => onChange({ appliedTo: event.target.value })}
          />
        </div>
      </div>

      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear filters
        </Button>
      )}
    </>
  )
}
