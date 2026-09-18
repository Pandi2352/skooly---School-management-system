import { DesktopIcon } from '@phosphor-icons/react'
import type { UserSession } from '@/features/users/types/user.types'
import { EmptyState } from '@/components/page/EmptyState'
import { LoadingState } from '@/components/page/LoadingState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { describeLastSignIn } from '@/features/users/utils/userRules'

type SessionListProps = {
  sessions: UserSession[]
  isLoading?: boolean
  /** Left out when the reader may look but not end a session. */
  onRevoke?: (session: UserSession) => void
  revokingId?: string
  emptyMessage: string
}

/**
 * Where an account is signed in. Seeing an unfamiliar device is how someone notices their password
 * has been shared, so the list names the browser, the address and when it was last used.
 */
export function SessionList({ sessions, isLoading, onRevoke, revokingId, emptyMessage }: SessionListProps) {
  if (isLoading) return <LoadingState label="Loading sessions" />

  if (sessions.length === 0) {
    return <EmptyState icon={DesktopIcon} title="No signed-in devices" description={emptyMessage} />
  }

  return (
    <ul className="divide-y divide-line">
      {sessions.map((session) => (
        <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-medium text-ink">
              {session.device}
              {session.isCurrent && <Badge tone="success">This device</Badge>}
            </p>
            <p className="text-sm text-ink-muted">
              {session.ip ? `${session.ip} · ` : ''}
              Last used {describeLastSignIn(session.lastSeenAt).toLowerCase()}
            </p>
          </div>

          {onRevoke && !session.isCurrent && (
            <Button
              variant="secondary"
              size="sm"
              loading={revokingId === session.id}
              onClick={() => onRevoke(session)}
            >
              Sign out
            </Button>
          )}
        </li>
      ))}
    </ul>
  )
}
