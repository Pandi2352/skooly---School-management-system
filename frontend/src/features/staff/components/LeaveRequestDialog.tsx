import { useState, type SyntheticEvent } from 'react'
import { LEAVE_TYPES } from '../constants'
import type { LeaveType } from '../constants'
import { useSubmitLeave } from '../hooks/useStaff'
import { countLeaveDays, leaveTypeLabel } from '../utils/leaveUtils'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

type LeaveRequestDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultStaffId?: string
  staffList?: { id: string; name: string }[]
}

export function LeaveRequestDialog({
  open,
  onOpenChange,
  defaultStaffId = 'staff-001',
  staffList = [
    { id: 'staff-001', name: 'Priya Sharma (EMP-0001)' },
    { id: 'staff-002', name: 'Arjun Mehta (EMP-0002)' },
    { id: 'staff-003', name: 'Sunita Patil (EMP-0003)' },
    { id: 'staff-004', name: 'Vikram Joshi (EMP-0004)' },
    { id: 'staff-005', name: 'Ananya Roy (EMP-0005)' },
  ],
}: LeaveRequestDialogProps) {
  const [staffId, setStaffId] = useState(defaultStaffId)
  const [leaveType, setLeaveType] = useState<LeaveType>('casual')
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split('T')[0] ?? '2026-09-22',
  )
  const [toDate, setToDate] = useState(
    new Date().toISOString().split('T')[0] ?? '2026-09-22',
  )
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submitMutation = useSubmitLeave()

  const calculatedDays = countLeaveDays(fromDate, toDate)

  const handleSubmit = async () => {
    setError(null)

    if (!reason.trim()) {
      setError('Please provide a reason for the leave.')
      return
    }

    if (calculatedDays <= 0) {
      setError('Selected date range contains no working days or is invalid.')
      return
    }

    const staffMember = staffList.find((s) => s.id === staffId)
    const staffName = staffMember?.name.split(' (')[0] ?? 'Staff Member'

    try {
      await submitMutation.mutateAsync({
        staffId,
        staffName,
        leaveType,
        fromDate,
        toDate,
        days: calculatedDays,
        reason: reason.trim(),
      })
      onOpenChange(false)
      setReason('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit leave application.')
    }
  }

  const staffOptions = staffList.map((s) => ({ value: s.id, label: s.name }))
  const leaveTypeOptions = LEAVE_TYPES.map((t) => ({
    value: t,
    label: leaveTypeLabel(t),
  }))

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Submit Leave Application"
      description="Apply for leave on behalf of a staff member or faculty."
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={submitMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              void handleSubmit()
            }}
            loading={submitMutation.isPending}
          >
            Submit Application
          </Button>
        </div>
      }
    >
      <form
        onSubmit={(e: SyntheticEvent) => {
          e.preventDefault()
          void handleSubmit()
        }}
        className="grid gap-4 py-2"
      >
        {error && (
          <div className="rounded-sm bg-danger/10 p-3 text-sm text-danger">{error}</div>
        )}

        <Select
          label="Staff Member"
          required
          value={staffId}
          options={staffOptions}
          onValueChange={setStaffId}
        />

        <Select
          label="Leave Type"
          required
          value={leaveType}
          options={leaveTypeOptions}
          onValueChange={(val) => setLeaveType(val as LeaveType)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="From Date"
            type="date"
            required
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            label="To Date"
            type="date"
            required
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="rounded-md border border-line bg-canvas/60 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Total Working Days (excl. weekends):</span>
            <span className="text-base font-bold tabular-nums text-primary">
              {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>

        <Textarea
          label="Reason for Leave"
          required
          rows={3}
          placeholder="State reason clearly..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </form>
    </Dialog>
  )
}
