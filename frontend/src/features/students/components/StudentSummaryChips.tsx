import { UserMinusIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { formatNumber } from '@/lib/format'
import type { StudentSummary } from '../types/student.types'

/** School-wide counts under the page title. Unassigned turns amber only when someone needs placing. */
export function StudentSummaryChips({ summary }: { summary: StudentSummary }) {
  return (
    <>
      <li>
        <Badge tone="info">{formatNumber(summary.sessionTotal)} Session total</Badge>
      </li>
      <li>
        <Badge tone="neutral">{formatNumber(summary.allTime)} All time</Badge>
      </li>
      <li>
        <Badge tone={summary.unassigned > 0 ? 'planned' : 'neutral'} className="gap-1.5">
          <UserMinusIcon className="size-3.5" weight="bold" aria-hidden="true" />
          {formatNumber(summary.unassigned)} Unassigned
        </Badge>
      </li>
    </>
  )
}
