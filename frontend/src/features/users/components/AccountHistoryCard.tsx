import { ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import { EmptyState } from '@/components/page/EmptyState'
import { LoadingState } from '@/components/page/LoadingState'
import { Card } from '@/components/ui/Card'
import type { AccountEvent } from '../types/user.types'

type AccountHistoryCardProps = {
  events: AccountEvent[]
  isLoading: boolean
  personName: string
}

/**
 * What has happened to this account. It answers the questions that come up when something looks
 * wrong — who changed this person's role, when were they last locked out, who reset the password —
 * without anyone having to read a server log.
 */
export function AccountHistoryCard({ events, isLoading, personName }: AccountHistoryCardProps) {
  return (
    <Card
      title="History"
      description="Sign-ins, lockouts and changes made by administrators, newest first."
      className="xl:col-span-2"
    >
      {isLoading ? (
        <LoadingState label="Loading the history" />
      ) : events.length === 0 ? (
        <EmptyState
          icon={ClockCounterClockwiseIcon}
          title="Nothing recorded yet"
          description={`Anything that happens to ${personName}'s account from now on appears here.`}
        />
      ) : (
        <ol className="divide-y divide-line">
          {events.map((event) => (
            <li key={event.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="font-medium text-ink">{event.label}</p>
                <p className="text-sm text-ink-muted">
                  {event.summary && <span>{event.summary}</span>}
                  {event.summary && event.actorName && <span aria-hidden="true"> · </span>}
                  {event.actorName && <span>by {event.actorName}</span>}
                  {event.ip && <span className="hidden sm:inline"> · {event.ip}</span>}
                </p>
              </div>
              <time dateTime={event.at} className="text-sm whitespace-nowrap text-ink-muted">
                {new Date(event.at).toLocaleString()}
              </time>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}
