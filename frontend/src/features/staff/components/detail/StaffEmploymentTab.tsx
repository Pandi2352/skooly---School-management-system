import type { StaffDetail } from '../../types/staff.types'
import { Card } from '@/components/ui/Card'
import { StaffStatusBadge } from '../StaffStatusBadge'
import { typeLabel } from '../../utils/staffStatus'
import { formatCurrency } from '@/lib/format'

type StaffEmploymentTabProps = {
  staff: StaffDetail
}

export function StaffEmploymentTab({ staff }: StaffEmploymentTabProps) {
  const { employment } = staff

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
        Employment & Position Details
      </h3>
      <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
        <div>
          <dt className="text-xs text-ink-muted">Employee ID</dt>
          <dd className="font-mono text-sm font-semibold text-ink">{employment.employeeId}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Designation</dt>
          <dd className="font-semibold text-ink">{employment.designation}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Department</dt>
          <dd className="font-medium text-ink">{employment.department}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Employment Type</dt>
          <dd className="font-medium text-ink">{typeLabel(employment.employmentType)}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Date of Joining</dt>
          <dd className="font-medium tabular-nums text-ink">{employment.dateOfJoining}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Current Status</dt>
          <dd className="mt-1">
            <StaffStatusBadge status={employment.status} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Reporting Manager</dt>
          <dd className="font-medium text-ink">{employment.reportingTo ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Gross Salary</dt>
          <dd className="font-semibold tabular-nums text-ink">
            {employment.salaryPaise ? formatCurrency(employment.salaryPaise / 100) : '—'}
          </dd>
        </div>
      </dl>
    </Card>
  )
}
