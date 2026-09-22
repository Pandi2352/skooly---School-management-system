import { CalendarCheckIcon, UserMinusIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { CountRail, type CountSegment } from '@/components/page/CountRail'
import type { StudentSummary } from '../types/student.types'

/**
 * School-wide figures above the list. Unassigned is kept even at zero: "nobody is waiting for a
 * class" is worth saying, and a count that disappears is a count nobody trusts. It turns amber only
 * when somebody actually needs placing.
 */
export function StudentSummaryRail({ summary }: { summary: StudentSummary }) {
  const segments: CountSegment[] = [
    {
      id: 'sessionTotal',
      label: 'This session',
      count: summary.sessionTotal,
      icon: CalendarCheckIcon,
      tone: 'primary',
      hint: 'Students admitted for the current academic session',
    },
    {
      id: 'allTime',
      label: 'All time',
      count: summary.allTime,
      icon: UsersThreeIcon,
      hint: 'Every student ever admitted',
    },
    {
      id: 'unassigned',
      label: 'Unassigned',
      count: summary.unassigned,
      icon: UserMinusIcon,
      tone: summary.unassigned > 0 ? 'warning' : 'neutral',
      hint: 'Admitted students with no class and section yet',
    },
  ]

  return <CountRail label="Student totals" segments={segments} />
}
