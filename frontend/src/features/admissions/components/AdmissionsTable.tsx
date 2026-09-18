import { CheckIcon, ClockIcon, EyeIcon, GraduationCapIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/page/EmptyState'
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
  onReview: (app: AdmissionApplication) => void
  onEnroll: (app: AdmissionApplication) => void
}

export function AdmissionsTable({ applications, isLoading, onReview, onEnroll }: Props) {
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
    <Table
      caption="Admission applications"
      hideCaption
      bordered={false}
      columns={columns}
      rows={applications}
      getRowKey={(app) => app._id}
      isLoading={isLoading}
      empty={
        <EmptyState
          title="No applications match this view"
          description="Try a different grade, clear the search, or pick another status above."
        />
      }
    />
  )
}
