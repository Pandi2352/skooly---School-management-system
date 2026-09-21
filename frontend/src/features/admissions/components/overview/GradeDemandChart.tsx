import { EmptyState } from '@/components/page/EmptyState'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { AdmissionGradeCount } from '../../schemas/admissionPipeline.schema'

type GradeDemandChartProps = {
  grades: AdmissionGradeCount[]
}

/**
 * Where the demand is, by grade. Horizontal bars because the labels are words ("Grade 10") and a
 * vertical axis would turn them sideways; one hue, because this is magnitude, not identity.
 *
 * Built from divs rather than SVG: a bar chart of a dozen rows is a list with widths, and this way
 * the numbers are real text that wraps, selects and reads correctly to a screen reader.
 */
export function GradeDemandChart({ grades }: GradeDemandChartProps) {
  const highest = Math.max(1, ...grades.map((entry) => entry.count))
  const busiest = grades.reduce<AdmissionGradeCount | null>(
    (leader, entry) => (leader === null || entry.count > leader.count ? entry : leader),
    null,
  )

  return (
    <Card
      title="Demand by grade"
      description={busiest ? `Grade ${busiest.grade} has the most applications` : undefined}
      className="min-w-0"
    >
      {grades.length === 0 ? (
        <EmptyState title="No applications yet" description="Grades appear here as families apply." />
      ) : (
        <ul className="grid gap-2">
          {grades.map((entry) => {
            const share = (entry.count / highest) * 100
            const isBusiest = entry.grade === busiest?.grade
            return (
              <li key={entry.grade} className="grid grid-cols-[4.5rem_1fr_2rem] items-center gap-3">
                <span className="text-sm whitespace-nowrap text-ink-muted">Grade {entry.grade}</span>
                <span className="h-5 rounded-sm bg-canvas">
                  {/* Rounded at the data end only, anchored to the baseline. */}
                  <span
                    className={cn(
                      'block h-5 rounded-e-sm',
                      isBusiest ? 'bg-primary' : 'bg-primary/45',
                    )}
                    style={{ width: `${Math.max(share, 2)}%` }}
                  />
                </span>
                <span className="text-end text-sm font-semibold tabular-nums text-ink">{entry.count}</span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
