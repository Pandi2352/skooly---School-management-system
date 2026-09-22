import { XIcon } from '@phosphor-icons/react'
import { DEPARTMENTS, EMPLOYMENT_STATUSES } from '../constants'
import type { Department, EmploymentStatus } from '../constants'
import { STATUS_LABEL } from '../utils/staffStatus'
import type { StaffFilters as StaffFiltersType } from '../types/staff.types'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'

type StaffFiltersProps = {
  filters: StaffFiltersType
  onUpdate: (changes: Partial<StaffFiltersType>) => void
  onReset: () => void
  isFiltered: boolean
}

export function StaffFilters({
  filters,
  onUpdate,
  onReset,
  isFiltered,
}: StaffFiltersProps) {
  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...DEPARTMENTS.map((dept) => ({ value: dept, label: dept })),
  ]

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...EMPLOYMENT_STATUSES.map((status) => ({
      value: status,
      label: STATUS_LABEL[status],
    })),
  ]

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            label="Search staff"
            placeholder="Search by ID, name, designation..."
            value={filters.search}
            onValueChange={(search) => onUpdate({ search, page: 1 })}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            label="Department filter"
            hideLabel
            size="sm"
            value={filters.department || 'all'}
            options={departmentOptions}
            onValueChange={(val) =>
              onUpdate({ department: val === 'all' ? '' : (val as Department), page: 1 })
            }
          />
        </div>

        <div className="w-full sm:w-44">
          <Select
            label="Status filter"
            hideLabel
            size="sm"
            value={filters.status || 'all'}
            options={statusOptions}
            onValueChange={(val) =>
              onUpdate({ status: val === 'all' ? '' : (val as EmploymentStatus), page: 1 })
            }
          />
        </div>
      </div>

      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="self-start text-ink-muted hover:text-ink sm:self-center"
        >
          <XIcon className="size-4" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
