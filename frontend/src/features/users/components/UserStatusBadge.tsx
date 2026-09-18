import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Tooltip } from '@/components/ui/Tooltip'
import { USER_STATUS_HINTS, USER_STATUS_LABELS, type UserStatus } from '../constants'

const TONES: Record<UserStatus, BadgeTone> = {
  invited: 'info',
  active: 'success',
  suspended: 'danger',
  archived: 'neutral',
}

/** The word carries the meaning; the colour only reinforces it, and the hint explains it. */
export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <Tooltip content={USER_STATUS_HINTS[status]}>
      <Badge tone={TONES[status]}>{USER_STATUS_LABELS[status]}</Badge>
    </Tooltip>
  )
}
