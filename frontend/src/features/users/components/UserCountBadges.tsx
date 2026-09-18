import { ShieldCheckIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { formatNumber } from '@/lib/format'
import type { UserListMeta } from '../types/user.types'

/**
 * School-wide counts under the page title, the same shape the student list uses. Suspended and
 * archived appear only when there are any: a row of zeroes is noise on most days.
 */
export function UserCountBadges({ meta }: { meta: UserListMeta }) {
  return (
    <>
      <li>
        <Badge tone="info">{formatNumber(meta.active)} Active</Badge>
      </li>
      {meta.invited > 0 && (
        <li>
          <Badge tone="planned">{formatNumber(meta.invited)} Invited</Badge>
        </li>
      )}
      {meta.suspended > 0 && (
        <li>
          <Badge tone="danger">{formatNumber(meta.suspended)} Suspended</Badge>
        </li>
      )}
      {meta.archived > 0 && (
        <li>
          <Badge tone="neutral">{formatNumber(meta.archived)} Archived</Badge>
        </li>
      )}
      <li>
        <Badge tone="neutral" className="gap-1.5">
          <ShieldCheckIcon className="size-3.5" weight="bold" aria-hidden="true" />
          {formatNumber(meta.administrators)} Administrator{meta.administrators === 1 ? '' : 's'}
        </Badge>
      </li>
    </>
  )
}
