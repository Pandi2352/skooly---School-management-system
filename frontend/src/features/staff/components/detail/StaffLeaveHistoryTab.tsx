import { useLeaves } from '../../hooks/useStaff'
import type { StaffDetail } from '../../types/staff.types'
import { Card } from '@/components/ui/Card'
import { leaveStatusTone, leaveTypeLabel } from '../../utils/leaveUtils'

type StaffLeaveHistoryTabProps = {
  staff: StaffDetail
}

export function StaffLeaveHistoryTab({ staff }: StaffLeaveHistoryTabProps) {
  const { leaveBalance } = staff
  const { data: leaves = [], isLoading } = useLeaves({
    staffId: staff.id,
    leaveType: '',
    status: '',
    from: '',
    to: '',
  })

  const staffLeaves = leaves.filter((l) => l.staffId === staff.id)

  return (
    <div className="grid gap-6">
      {/* Leave Balances */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Current Leave Balances
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-md border border-line bg-canvas/60 p-3 text-center">
            <div className="text-2xl font-bold tabular-nums text-primary">
              {leaveBalance.casual}
            </div>
            <div className="text-xs text-ink-muted">Casual Leave</div>
          </div>
          <div className="rounded-md border border-line bg-canvas/60 p-3 text-center">
            <div className="text-2xl font-bold tabular-nums text-primary">
              {leaveBalance.medical}
            </div>
            <div className="text-xs text-ink-muted">Medical Leave</div>
          </div>
          <div className="rounded-md border border-line bg-canvas/60 p-3 text-center">
            <div className="text-2xl font-bold tabular-nums text-primary">
              {leaveBalance.earned}
            </div>
            <div className="text-xs text-ink-muted">Earned Leave</div>
          </div>
          <div className="rounded-md border border-line bg-canvas/60 p-3 text-center">
            <div className="text-2xl font-bold tabular-nums text-primary">
              {leaveBalance.maternity}
            </div>
            <div className="text-xs text-ink-muted">Maternity</div>
          </div>
          <div className="rounded-md border border-line bg-canvas/60 p-3 text-center">
            <div className="text-2xl font-bold tabular-nums text-primary">
              {leaveBalance.paternity}
            </div>
            <div className="text-xs text-ink-muted">Paternity</div>
          </div>
        </div>
      </Card>

      {/* Leave Application History */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Leave Applications History
        </h3>
        {isLoading ? (
          <div className="py-4 text-sm text-ink-muted">Loading leave history...</div>
        ) : staffLeaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs font-semibold uppercase text-ink-muted">
                <tr>
                  <th className="py-2 pr-4">Leave Type</th>
                  <th className="py-2 pr-4">From</th>
                  <th className="py-2 pr-4">To</th>
                  <th className="py-2 pr-4">Days</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {staffLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-canvas/50">
                    <td className="py-2.5 pr-4 font-medium text-ink">
                      {leaveTypeLabel(leave.leaveType)}
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums text-ink-muted">{leave.fromDate}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-ink-muted">{leave.toDate}</td>
                    <td className="py-2.5 pr-4 tabular-nums font-semibold text-ink">
                      {leave.days} {leave.days === 1 ? 'day' : 'days'}
                    </td>
                    <td className="py-2.5 pr-4 text-ink-muted">{leave.reason}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${leaveStatusTone(
                          leave.status,
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-ink-muted">No leave applications found for this staff member.</div>
        )}
      </Card>
    </div>
  )
}
