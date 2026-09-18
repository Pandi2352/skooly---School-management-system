import { cn } from '@/lib/cn'
import type { UserListMeta } from '../types/user.types'
import type { UserStatus } from '../constants'

type UserCountsBarProps = {
  meta: UserListMeta
  status: UserStatus | 'all'
  onSelect: (status: UserStatus | 'all') => void
}

/**
 * How many accounts are in each state, and a one-click filter for each. The counts cover the whole
 * school, not the current page, so they answer "how many people can sign in?" on their own.
 */
export function UserCountsBar({ meta, status, onSelect }: UserCountsBarProps) {
  const counts: { key: UserStatus | 'all'; label: string; value: number; hint: string }[] = [
    { key: 'active', label: 'Active', value: meta.active, hint: 'Can sign in' },
    { key: 'invited', label: 'Invited', value: meta.invited, hint: 'Waiting to set a password' },
    { key: 'suspended', label: 'Suspended', value: meta.suspended, hint: 'Blocked, can be switched back on' },
    { key: 'archived', label: 'Archived', value: meta.archived, hint: 'Kept for past records only' },
  ]

  return (
    <div className="grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-4">
      {counts.map((count) => {
        const selected = status === count.key
        return (
          <button
            key={count.key}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(selected ? 'all' : count.key)}
            className={cn(
              'cursor-pointer rounded-md border bg-surface px-4 py-3 text-start transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-primary',
              selected ? 'border-primary' : 'border-line',
            )}
          >
            <span className="block text-2xl font-bold tabular-nums text-ink">{count.value}</span>
            <span className="block font-medium text-ink">{count.label}</span>
            <span className="block text-sm text-ink-muted">{count.hint}</span>
          </button>
        )
      })}
    </div>
  )
}
