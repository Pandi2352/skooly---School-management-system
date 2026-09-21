import { EmptyState } from '@/components/page/EmptyState'
import { Card } from '@/components/ui/Card'
import type { AdmissionGradeCount } from '../../schemas/admissionPipeline.schema'

type GradeDemandChartProps = {
  grades: AdmissionGradeCount[]
}

// Typical section capacity per grade (e.g. 40 seats for elementary, 35 for middle, 30 for high)
const getGradeCapacity = (grade: number) => {
  if (grade <= 5) return 40
  if (grade <= 8) return 35
  return 30
}

export function GradeDemandChart({ grades }: GradeDemandChartProps) {
  const busiest = grades.reduce<AdmissionGradeCount | null>(
    (leader, entry) => (leader === null || entry.count > leader.count ? entry : leader),
    null,
  )

  return (
    <Card
      title="Grade-wise Demand vs Sanctioned Capacity"
      description={busiest ? `Grade ${busiest.grade} has the highest applicant concentration` : 'Intake volume by academic grade'}
      className="min-w-0"
    >
      {grades.length === 0 ? (
        <EmptyState title="No applications yet" description="Grades appear here as families apply." />
      ) : (
        <div className="grid gap-3">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-muted border-b border-line pb-1.5">
            <span>Grade & Division</span>
            <div className="flex items-center gap-6">
              <span>Applications</span>
              <span className="w-16 text-end">Capacity</span>
              <span className="w-16 text-end">Fill Rate</span>
            </div>
          </div>

          <ul className="grid gap-2.5">
            {grades.map((entry) => {
              const capacity = getGradeCapacity(entry.grade)
              const ratio = Math.round((entry.count / capacity) * 100)
              const isOverCapacity = ratio >= 100
              const isNearCapacity = ratio >= 80 && ratio < 100

              const barColor = isOverCapacity
                ? 'bg-rose-600'
                : isNearCapacity
                  ? 'bg-accent'
                  : 'bg-primary'

              const statusBadge = isOverCapacity ? (
                <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400">
                  Waitlist
                </span>
              ) : isNearCapacity ? (
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-400">
                  Filling Fast
                </span>
              ) : (
                <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  Seats Open
                </span>
              )

              return (
                <li key={entry.grade} className="grid gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">Grade {entry.grade}</span>
                      {statusBadge}
                    </div>
                    <div className="flex items-center gap-6 text-xs tabular-nums">
                      <span className="font-bold text-ink">{entry.count}</span>
                      <span className="w-16 text-end text-ink-muted">{capacity} seats</span>
                      <span className="w-16 text-end font-semibold text-ink">{ratio}%</span>
                    </div>
                  </div>

                  {/* Dual-tone Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-sm bg-canvas ring-1 ring-line/50">
                    <div
                      className={`h-2 rounded-sm ${barColor} transition-all duration-500`}
                      style={{ width: `${Math.min(ratio, 100)}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </Card>
  )
}
