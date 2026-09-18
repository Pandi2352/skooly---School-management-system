import { CheckIcon, ClockIcon, EyeIcon, GraduationCapIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'
import {
  calculateApplicantAge,
  formatAdmissionStatus,
  getAdmissionStatusTone,
  getVerifiedDocumentsCount,
} from '../utils/admissionsPipelineUtils'

type Props = {
  applications: AdmissionApplication[]
  isLoading: boolean
  search: string
  onSearchChange: (val: string) => void
  grade: number | undefined
  onGradeChange: (grade: number | undefined) => void
  onReview: (app: AdmissionApplication) => void
  onEnroll: (app: AdmissionApplication) => void
}

const gradeOptions = [
  { value: '', label: 'All Grades' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
]

export function AdmissionsTable({
  applications,
  isLoading,
  search,
  onSearchChange,
  grade,
  onGradeChange,
  onReview,
  onEnroll,
}: Props) {
  const columns: TableColumn<AdmissionApplication>[] = [
    {
      key: 'applicationNo',
      header: 'Application #',
      cell: (app) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs font-semibold text-ink">
            {app.applicationNo}
          </span>
          <span className="text-[0.75rem] text-ink-muted">
            {new Date(app.appliedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'student',
      header: 'Applicant Name',
      cell: (app) => {
        const age = calculateApplicantAge(app.student.dateOfBirth)
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-canvas font-semibold text-ink text-xs border border-line">
              {app.student.firstName[0]}
              {app.student.lastName[0]}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-ink text-sm">
                {app.student.firstName} {app.student.lastName}
              </span>
              <span className="text-xs text-ink-muted">
                Grade {app.student.gradeApplied} • {app.student.gender} • {age} yrs
              </span>
            </div>
          </div>
        )
      },
    },
    {
      key: 'parent',
      header: 'Parent / Guardian',
      cell: (app) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-ink">{app.parent.name}</span>
          <span className="text-ink-muted capitalize">
            {app.parent.guardianType} • {app.parent.phone}
          </span>
        </div>
      ),
    },
    {
      key: 'documents',
      header: 'Documents',
      cell: (app) => {
        const docInfo = getVerifiedDocumentsCount(app.documents)
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-medium ${
                docInfo.isComplete
                  ? 'bg-success-soft text-success border border-success/30'
                  : 'bg-canvas text-ink-muted border border-line'
              }`}
            >
              {docInfo.isComplete ? (
                <CheckIcon className="h-3 w-3" weight="bold" />
              ) : (
                <ClockIcon className="h-3 w-3" />
              )}
              {docInfo.verified}/{docInfo.total} verified
            </span>
          </div>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      cell: (app) => (
        <Badge tone={getAdmissionStatusTone(app.status)}>
          {formatAdmissionStatus(app.status)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (app) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onReview(app)}
            className="flex items-center gap-1.5 text-xs"
          >
            <EyeIcon className="h-3.5 w-3.5" />
            Review
          </Button>

          {app.status === 'approved' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEnroll(app)}
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <GraduationCapIcon className="h-3.5 w-3.5" weight="bold" />
              Enroll
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-72">
          <SearchInput
            label="Search applications"
            placeholder="Search by name, app #, or parent..."
            value={search}
            onValueChange={onSearchChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-40">
            <Select
              label="Filter by Grade"
              hideLabel
              value={grade ? String(grade) : ''}
              onValueChange={(val: string) => onGradeChange(val ? Number(val) : undefined)}
              options={gradeOptions}
            />
          </div>
        </div>
      </div>

      <Table
        caption="Admissions Pipeline Applications"
        columns={columns}
        rows={applications}
        getRowKey={(app) => app._id}
        isLoading={isLoading}
        empty={
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-ink">No admission applications found</p>
            <p className="mt-1 text-xs text-ink-muted">
              Try adjusting your search terms or filter criteria.
            </p>
          </div>
        }
      />
    </div>
  )
}
