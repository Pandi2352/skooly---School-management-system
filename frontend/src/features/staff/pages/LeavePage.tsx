import { CalendarCheckIcon, CalendarPlusIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { PageContainer } from '@/components/page/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import { LEAVE_TYPES } from '../constants'
import type { LeaveStatus, LeaveType } from '../constants'
import { LeaveApprovalActions } from '../components/LeaveApprovalActions'
import { LeaveRequestDialog } from '../components/LeaveRequestDialog'
import { useLeaves } from '../hooks/useStaff'
import type { LeaveApplication, LeaveFilters } from '../types/staff.types'
import { leaveStatusTone, leaveTypeLabel } from '../utils/leaveUtils'

export function LeavePage() {
  const [selectedStatus, setSelectedStatus] = useState<LeaveStatus | ''>('')
  const [selectedType, setSelectedType] = useState<LeaveType | ''>('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const filters: LeaveFilters = {
    leaveType: selectedType,
    status: selectedStatus,
    from: '',
    to: '',
  }

  const { data: leaves = [], isLoading, error, refetch } = useLeaves(filters)

  // Quick KPI metrics
  const total = leaves.length
  const pending = leaves.filter((l) => l.status === 'pending').length
  const approved = leaves.filter((l) => l.status === 'approved').length
  const rejected = leaves.filter((l) => l.status === 'rejected').length

  const filteredLeaves = leaves.filter((leave) => {
    if (selectedStatus && leave.status !== selectedStatus) return false
    if (selectedType && leave.leaveType !== selectedType) return false
    return true
  })

  const columns: TableColumn<LeaveApplication>[] = [
    {
      key: 'staffName',
      header: 'Staff Member',
      cell: (leave) => (
        <div>
          <div className="font-semibold text-ink">{leave.staffName ?? 'Staff Member'}</div>
          <div className="font-mono text-xs text-ink-muted">ID: {leave.staffId}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Leave Type',
      cell: (leave) => (
        <span className="font-medium text-ink">{leaveTypeLabel(leave.leaveType)}</span>
      ),
    },
    {
      key: 'dates',
      header: 'Duration',
      cell: (leave) => (
        <div className="text-xs">
          <div className="tabular-nums font-medium text-ink">
            {leave.fromDate} → {leave.toDate}
          </div>
          <div className="text-ink-muted">
            {leave.days} {leave.days === 1 ? 'working day' : 'working days'}
          </div>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      cell: (leave) => (
        <div className="max-w-xs text-xs text-ink-muted">
          <p className="line-clamp-2">{leave.reason}</p>
          {leave.remarks && (
            <p className="mt-1 font-medium text-danger">Remarks: {leave.remarks}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (leave) => (
        <span
          className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold ${leaveStatusTone(
            leave.status,
          )}`}
        >
          {leave.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action / Review',
      align: 'end',
      cell: (leave) => (
        <div className="flex justify-end">
          {leave.status === 'pending' ? (
            <LeaveApprovalActions leave={leave} />
          ) : (
            <span className="text-xs text-ink-muted">
              {leave.approvedBy ? `Reviewed by ${leave.approvedBy}` : 'Processed'}
            </span>
          )}
        </div>
      ),
    },
  ]

  return (
    <PageContainer
      title="Staff Leave Management"
      description="Track absence requests, approve faculty leaves, and monitor leave utilization."
      fullWidth
      actions={
        <Button
          variant="primary"
          onClick={() => setDialogOpen(true)}
        >
          <CalendarPlusIcon className="size-4" />
          Submit Leave Request
        </Button>
      }
    >
      <div className="space-y-6">
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Total Requests
              </span>
              <CalendarCheckIcon className="size-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-ink">{total}</div>
          </Card>

          <Card className="p-4 border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Pending Approval
              </span>
              <ClockIcon className="size-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-amber-600">
              {pending}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Approved
              </span>
              <CheckCircleIcon className="size-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-emerald-600">
              {approved}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Rejected
              </span>
              <XCircleIcon className="size-4 text-rose-600" />
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-rose-600">
              {rejected}
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus('')}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedStatus === ''
                    ? 'border-primary bg-primary text-surface'
                    : 'border-line bg-surface text-ink-muted hover:text-ink'
                }`}
              >
                All Statuses
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('pending')}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedStatus === 'pending'
                    ? 'border-amber-600 bg-amber-600 text-white'
                    : 'border-line bg-surface text-ink-muted hover:text-amber-700'
                }`}
              >
                Pending ({pending})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('approved')}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedStatus === 'approved'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-line bg-surface text-ink-muted hover:text-emerald-700'
                }`}
              >
                Approved ({approved})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('rejected')}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedStatus === 'rejected'
                    ? 'border-rose-600 bg-rose-600 text-white'
                    : 'border-line bg-surface text-ink-muted hover:text-rose-700'
                }`}
              >
                Rejected ({rejected})
              </button>
            </div>

            <div className="w-full sm:w-56">
              <Select
                label="Leave Type filter"
                hideLabel
                size="sm"
                value={selectedType || 'all'}
                options={[
                  { value: 'all', label: 'All Leave Types' },
                  ...LEAVE_TYPES.map((lt) => ({
                    value: lt,
                    label: leaveTypeLabel(lt),
                  })),
                ]}
                onValueChange={(val) =>
                  setSelectedType(val === 'all' ? '' : (val as LeaveType))
                }
              />
            </div>
          </div>
        </Card>

        {/* Leave Requests Table */}
        <Table
          caption="Staff leave applications"
          hideCaption
          columns={columns}
          rows={filteredLeaves}
          getRowKey={(leave) => leave.id}
          isLoading={isLoading}
          error={error instanceof Error ? error.message : undefined}
          onRetry={() => void refetch()}
          empty={
            <div className="p-8 text-center text-sm text-ink-muted">
              No leave applications found matching your criteria.
            </div>
          }
          bordered
        />
      </div>

      <LeaveRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </PageContainer>
  )
}
