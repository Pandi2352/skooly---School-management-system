import { WarningCircleIcon } from '@phosphor-icons/react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Table, type TableColumn } from '@/components/ui/Table'
import { formatDate } from '@/lib/format'
import type { AttendanceRecord, StudentDetail } from '../../types/student.types'

const statusTones: Record<'present' | 'absent' | 'late' | 'excused', BadgeTone> = {
  present: 'neutral',
  absent: 'danger',
  late: 'planned',
  excused: 'neutral',
}

const statusLabels: Record<'present' | 'absent' | 'late' | 'excused', string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late Arrival',
  excused: 'Excused Leave',
}

const columns: TableColumn<AttendanceRecord>[] = [
  {
    key: 'date',
    header: 'Date',
    cell: (rec) => (
      <span className="font-medium text-ink tabular-nums">{formatDate(rec.date)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Attendance',
    cell: (rec) => <Badge tone={statusTones[rec.status]}>{statusLabels[rec.status]}</Badge>,
  },
  {
    key: 'notes',
    header: 'Remarks',
    cell: (rec) => (
      <span className="text-xs text-ink-muted">{rec.notes ?? 'Regular classroom session'}</span>
    ),
  },
]

export function StudentAttendanceTab({ student }: { student: StudentDetail }) {
  const { attendanceSummary, recentAttendance } = student
  const isAtRisk = attendanceSummary.percentage < 75

  return (
    <div className="grid gap-6">
      {/* Attendance Summary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-line bg-surface p-4 shadow-2xs">
          <span className="text-xs font-medium tracking-wider text-ink-muted uppercase">
            Attendance Rate
          </span>
          <div
            className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${
              isAtRisk ? 'text-danger' : 'text-ink'
            }`}
          >
            {attendanceSummary.percentage}%
          </div>
          <span className="mt-1 block text-xs text-ink-muted">
            {isAtRisk ? 'Below 75% exam requirement' : 'Good standing (Above 75%)'}
          </span>
        </div>

        <div className="rounded-lg border border-line bg-surface p-4 shadow-2xs">
          <span className="text-xs font-medium tracking-wider text-ink-muted uppercase">
            Days Present
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-ink tabular-nums">
            {attendanceSummary.presentDays}
          </div>
          <span className="mt-1 block text-xs text-ink-muted">Attended school</span>
        </div>

        <div className="rounded-lg border border-line bg-surface p-4 shadow-2xs">
          <span className="text-xs font-medium tracking-wider text-ink-muted uppercase">
            Days Absent
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-danger tabular-nums">
            {attendanceSummary.absentDays}
          </div>
          <span className="mt-1 block text-xs text-ink-muted">Unexcused / illness absences</span>
        </div>

        <div className="rounded-lg border border-line bg-surface p-4 shadow-2xs">
          <span className="text-xs font-medium tracking-wider text-ink-muted uppercase">
            Total Working Days
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-ink tabular-nums">
            {attendanceSummary.totalDays}
          </div>
          <span className="mt-1 block text-xs text-ink-muted">Academic term to date</span>
        </div>
      </div>

      {isAtRisk && (
        <div className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          <WarningCircleIcon className="mt-0.5 size-5 flex-none" aria-hidden="true" />
          <div>
            <span className="font-bold">Attendance Notice: </span>
            Student attendance ({attendanceSummary.percentage}%) has dropped below the statutory 75%
            threshold. A parent counseling alert is recommended.
          </div>
        </div>
      )}

      {/* Recent Attendance Log */}
      <Card
        title="Recent Attendance Log"
        description="Daily period and classroom check-in records for the past two weeks."
      >
        <Table
          caption="Recent attendance"
          hideCaption
          bordered={false}
          columns={columns}
          primaryKey="date"
          rows={recentAttendance}
          getRowKey={(rec) => rec.date}
          isLoading={false}
          empty="No attendance records logged for this student yet."
        />
      </Card>
    </div>
  )
}
