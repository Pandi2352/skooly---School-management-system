import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { ALL_GRADES, GRADE_FILTER_OPTIONS } from '../constants/admissionFilters'

type AdmissionsToolbarProps = {
  search: string
  onSearchChange: (search: string) => void
  grade: number | undefined
  onGradeChange: (grade: number | undefined) => void
}

/** Filters on the left, search on the right. RecordsCard supplies the row and its spacing. */
export function AdmissionsToolbar({
  search,
  onSearchChange,
  grade,
  onGradeChange,
}: AdmissionsToolbarProps) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-40">
          <Select
            label="Grade"
            hideLabel
            size="sm"
            value={grade === undefined ? ALL_GRADES : String(grade)}
            onValueChange={(value) => onGradeChange(value === ALL_GRADES ? undefined : Number(value))}
            options={GRADE_FILTER_OPTIONS}
          />
        </div>
      </div>

      <div className="lg:w-72">
        <SearchInput
          label="Search applications by name, number or parent"
          placeholder="Search name, app # or parent"
          value={search}
          onValueChange={onSearchChange}
        />
      </div>
    </>
  )
}
