import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { AdmissionStats } from '../../schemas/admissionPipeline.schema'

type PipelineFunnelProps = {
  stats: AdmissionStats
}

/**
 * Where applications sit right now. These are states, not series, so they use the app's status
 * colours, and each one carries its label and count — colour alone never says which stage it is.
 *
 * Every row links to the list already filtered, because "three rejected" is a question, not a fact.
 */
export function PipelineFunnel({ stats }: PipelineFunnelProps) {
  const stages = [
    { id: 'under-review', label: 'Under review', count: stats.underReview, bar: 'bg-status', hint: 'Waiting on a decision' },
    { id: 'approved', label: 'Approved', count: stats.approved, bar: 'bg-success', hint: 'Ready to enrol' },
    { id: 'enrolled', label: 'Enrolled', count: stats.enrolled, bar: 'bg-primary', hint: 'Now students' },
    { id: 'rejected', label: 'Rejected', count: stats.rejected, bar: 'bg-danger', hint: 'Not proceeding' },
  ]
  const highest = Math.max(1, ...stages.map((stage) => stage.count))

  return (
    <Card title="Where applications stand" description={`${stats.total} in total`} className="min-w-0">
      <ul className="grid gap-3">
        {stages.map((stage) => (
          <li key={stage.id}>
            <Link
              to={`${paths.admissionsApplications}?status=${stage.id}`}
              className="grid gap-1.5 rounded-md p-1.5 -m-1.5 hover:bg-canvas focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-ink">{stage.label}</span>
                <span className="text-lg font-bold tabular-nums text-ink">{stage.count}</span>
              </span>
              <span className="h-2 rounded-sm bg-canvas">
                <span
                  className={cn('block h-2 rounded-e-sm', stage.bar)}
                  style={{ width: `${Math.max((stage.count / highest) * 100, 2)}%` }}
                />
              </span>
              <span className="text-sm text-ink-muted">{stage.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
