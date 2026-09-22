import { CheckIcon, ClockIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { EmptyState } from '@/components/page/EmptyState'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Table, type TableColumn } from '@/components/ui/Table'
import { cn } from '@/lib/cn'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'
import {
  calculateApplicantAge,
  formatAdmissionStatus,
  getAdmissionStatusTone,
  getVerifiedDocumentsCount,
} from '../utils/admissionsPipelineUtils'
import { AdmissionRowActions, type AdmissionAction } from './AdmissionRowActions'

type Props = {
  applications: AdmissionApplication[]
  isLoading: boolean
  isRefreshing?: boolean
  error?: string
  onRetry?: () => void
  onAction: (action: AdmissionAction, application: AdmissionApplication) => void
  empty: ReactNode
}

const dateOnly = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

export function AdmissionsTable({
  applications,
  isLoading,
  isRefreshing = false,
  error,
  onRetry,
  onAction,
  empty,
}: Props) {
  const columns: TableColumn<AdmissionApplication>[] = [
    {
      key: 'applicationNo',
      header: 'Application #',
      cell: (app) => (
        <span className="font-mono text-xs font-semibold whitespace-nowrap text-ink">
          {app.applicationNo}
        </span>
      ),
    },
    {
      key: 'student',
      header: 'Applicant',
      cell: (app) => (
        <div className="flex min-w-44 items-center gap-3">
          <Avatar
            name={`${app.student.firstName} ${app.student.lastName}`}
            src={app.student.photoUrl}
            size="sm"
          />
          <div className="min-w-0">
            <p className="font-medium text-ink">
              {app.student.firstName} {app.student.lastName}
            </p>
            <p className="text-sm text-ink-muted">
              {app.student.gender} · {calculateApplicantAge(app.student.dateOfBirth)} yrs
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'grade',
      header: 'Grade',
      cell: (app) => <span className="whitespace-nowrap">Grade {app.student.gradeApplied}</span>,
    },
    {
      key: 'parent',
      header: 'Parent / guardian',
      cell: (app) => (
        <div className="min-w-40">
          <p className="font-medium text-ink">{app.parent.name}</p>
          <p className="text-sm whitespace-nowrap text-ink-muted">
            <span className="capitalize">{app.parent.guardianType}</span> · {app.parent.phone}
          </p>
        </div>
      ),
    },
    {
      key: 'previousSchool',
      header: 'Previous school',
      cell: (app) =>
        app.student.previousSchool ? (
          <span className="block max-w-52 truncate" title={app.student.previousSchool}>
            {app.student.previousSchool}
          </span>
        ) : (
          <span className="text-ink-muted">—</span>
        ),
    },
    {
      key: 'documents',
      header: 'Documents',
      cell: (app) => {
        const { verified, total, isComplete } = getVerifiedDocumentsCount(app.documents)
        return (
          <Badge tone={isComplete ? 'success' : 'planned'} className="gap-1 whitespace-nowrap">
            {isComplete ? (
              <CheckIcon className="size-3.5" weight="bold" aria-hidden="true" />
            ) : (
              <ClockIcon className="size-3.5" aria-hidden="true" />
            )}
            {verified}/{total} verified
          </Badge>
        )
      },
    },
    {
      key: 'appliedAt',
      header: 'Applied',
      cell: (app) => <span className="whitespace-nowrap text-ink-muted">{dateOnly(app.appliedAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (app) => (
        <Badge tone={getAdmissionStatusTone(app.status)}>{formatAdmissionStatus(app.status)}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (app) => <AdmissionRowActions application={app} onAction={onAction} />,
    },
  ]

  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn('transition-opacity motion-reduce:transition-none', isRefreshing && 'opacity-60')}
    >
      <Table
        caption="Admission applications"
        hideCaption
        bordered={false}
        columns={columns}
        primaryKey="student"
        rows={applications}
        getRowKey={(app) => app._id}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        empty={empty ?? <EmptyState title="No applications" />}
      />
    </div>
  )
}
