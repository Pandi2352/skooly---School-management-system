import { FunnelIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { ClassOption, StudentFilters } from '../types/student.types'
import { isSiblingFilter, isStatusFilter } from '../utils/studentStatus'

export type StudentFilterDraft = Pick<
  StudentFilters,
  'classGrade' | 'section' | 'siblings' | 'status'
>

type StudentFilterPanelProps = {
  /** The filters currently in the URL. Remount with a `key` when they change. */
  applied: StudentFilterDraft
  classOptions: ClassOption[] | undefined
  onApply: (draft: StudentFilterDraft) => void
  onClear: () => void
}

const siblingOptions = [
  { value: 'all', label: 'All students' },
  { value: 'with', label: 'With siblings' },
  { value: 'without', label: 'Without siblings' },
]

const enrollmentOptions = [
  { value: 'all', label: 'Any status' },
  { value: 'enrolled', label: 'Currently studying' },
  { value: 'pending', label: 'Admission pending' },
  { value: 'left', label: 'Left school' },
]

/** Choices are collected in a draft and applied together with Filter, so each pick doesn't reload the list. */
export function StudentFilterPanel({
  applied,
  classOptions,
  onApply,
  onClear,
}: StudentFilterPanelProps) {
  const [draft, setDraft] = useState(applied)
  const sections = classOptions?.find((option) => option.grade === draft.classGrade)?.sections ?? []

  return (
    <form
      aria-label="Filter students"
      className="flex flex-col gap-4 rounded-md border border-line bg-surface p-4 xl:flex-row xl:items-end print:hidden"
      onSubmit={(event) => {
        event.preventDefault()
        onApply(draft)
      }}
    >
      <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          label="Class"
          disabled={!classOptions}
          placeholder={classOptions ? 'All classes' : 'Loading classes…'}
          options={[
            { value: 'all', label: 'All classes' },
            ...(classOptions ?? []).map((option) => ({
              value: String(option.grade),
              label: option.label,
            })),
          ]}
          value={draft.classGrade === null ? 'all' : String(draft.classGrade)}
          onValueChange={(value) => {
            const grade = Number(value)
            setDraft((current) => ({
              ...current,
              classGrade: Number.isInteger(grade) && grade > 0 ? grade : null,
              section: null,
            }))
          }}
        />
        <Select
          label="Section"
          disabled={draft.classGrade === null}
          placeholder={draft.classGrade === null ? 'Choose a class first' : 'All sections'}
          options={[
            { value: 'all', label: 'All sections' },
            ...sections.map((section) => ({ value: section, label: `Section ${section}` })),
          ]}
          value={draft.classGrade === null ? '' : (draft.section ?? 'all')}
          onValueChange={(value) => {
            setDraft((current) => ({ ...current, section: value === 'all' ? null : value }))
          }}
        />
        <Select
          label="Siblings"
          options={siblingOptions}
          value={draft.siblings}
          onValueChange={(value) => {
            if (isSiblingFilter(value)) setDraft((current) => ({ ...current, siblings: value }))
          }}
        />
        <Select
          label="Enrollment"
          options={enrollmentOptions}
          value={draft.status}
          onValueChange={(value) => {
            if (isStatusFilter(value)) setDraft((current) => ({ ...current, status: value }))
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">
          <FunnelIcon className="size-4.5" aria-hidden="true" />
          Filter
        </Button>
        <Button variant="secondary" onClick={onClear}>
          <XIcon className="size-4.5" aria-hidden="true" />
          Clear
        </Button>
      </div>
    </form>
  )
}
