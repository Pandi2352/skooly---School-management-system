import { Badge } from '@/components/ui/Badge'
import { formatNumber } from '@/lib/format'
import type { StudentPage } from '../types/student.types'

/** Counts for the current class, section, sibling and search filters, split by enrollment. */
export function StudentStats({ counts }: { counts: StudentPage['counts'] }) {
  return (
    <ul aria-label="Student counts" className="flex flex-wrap gap-1.5">
      <li>
        <Badge tone="neutral">{formatNumber(counts.all)} matching</Badge>
      </li>
      <li>
        <Badge tone="neutral">{formatNumber(counts.enrolled)} studying</Badge>
      </li>
      {counts.pending > 0 && (
        <li>
          <Badge tone="planned">{formatNumber(counts.pending)} admission pending</Badge>
        </li>
      )}
      {counts.left > 0 && (
        <li>
          <Badge tone="neutral">{formatNumber(counts.left)} left</Badge>
        </li>
      )}
    </ul>
  )
}
