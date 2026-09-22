import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useUpdateLeaveStatus } from '../hooks/useStaff'
import type { LeaveApplication } from '../types/staff.types'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Textarea } from '@/components/ui/Textarea'

type LeaveApprovalActionsProps = {
  leave: LeaveApplication
}

export function LeaveApprovalActions({ leave }: LeaveApprovalActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const [remarks, setRemarks] = useState('')
  const updateStatusMutation = useUpdateLeaveStatus()

  if (leave.status !== 'pending') {
    return null
  }

  const handleApprove = async () => {
    await updateStatusMutation.mutateAsync({
      id: leave.id,
      status: 'approved',
    })
  }

  const handleReject = async () => {
    await updateStatusMutation.mutateAsync({
      id: leave.id,
      status: 'rejected',
      remarks: remarks.trim() || undefined,
    })
    setRejectOpen(false)
    setRemarks('')
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            void handleApprove()
          }}
          loading={updateStatusMutation.isPending}
          className="h-7 text-xs"
        >
          <CheckIcon className="size-3.5" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setRejectOpen(true)}
          disabled={updateStatusMutation.isPending}
          className="h-7 text-xs text-danger hover:bg-danger/10 hover:text-danger"
        >
          <XIcon className="size-3.5" />
          Reject
        </Button>
      </div>

      <Dialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Reject Leave Application"
        description={`Rejecting leave request for ${leave.staffName ?? 'Staff Member'} (${leave.days} days, ${leave.fromDate} to ${leave.toDate}).`}
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRejectOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                void handleReject()
              }}
              loading={updateStatusMutation.isPending}
            >
              Confirm Rejection
            </Button>
          </div>
        }
      >
        <div className="py-2">
          <Textarea
            label="Reason for Rejection (optional)"
            placeholder="e.g. Inadequate staffing on selected dates..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
          />
        </div>
      </Dialog>
    </>
  )
}
