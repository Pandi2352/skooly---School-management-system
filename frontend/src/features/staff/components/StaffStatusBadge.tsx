import type { EmploymentStatus } from '../constants'
import { statusLabel, statusTone } from '../utils/staffStatus'
import { cn } from '@/lib/cn'

type StaffStatusBadgeProps = {
  status: EmploymentStatus
  className?: string
}

export function StaffStatusBadge({ status, className }: StaffStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium',
        statusTone(status),
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  )
}
