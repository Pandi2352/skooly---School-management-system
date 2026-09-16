import { CloudIcon, PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { EmptyState } from '@/components/page/EmptyState'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { Button } from '@/components/ui/Button'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { TELEGRAM_FILE_LIMIT_MB } from '../constants'
import { useDestinations } from '../hooks/useDestinations'
import { AddDestinationDialog } from './AddDestinationDialog'
import { BackupSection } from './BackupSection'
import { DestinationRow } from './DestinationRow'

export function OffsiteCopiesCard() {
  const destinations = useDestinations()
  const [addOpen, setAddOpen] = useState(false)

  let body
  if (destinations.isPending) body = <LoadingState label="Loading destinations" />
  else if (destinations.isError) {
    body = (
      <ErrorState
        title="Couldn’t load destinations"
        description={getErrorMessage(destinations.error)}
        onRetry={() => void destinations.refetch()}
      />
    )
  } else if (destinations.data.length === 0) {
    body = (
      <EmptyState
        icon={CloudIcon}
        title="No off-site copies yet"
        description="Add Telegram or Email to keep your data safe off this server."
      />
    )
  } else {
    body = (
      <ul className="divide-y divide-line">
        {destinations.data.map((destination) => (
          <DestinationRow key={destination.id} destination={destination} />
        ))}
      </ul>
    )
  }

  return (
    <BackupSection
      id="offsite-copies"
      icon={CloudIcon}
      title="Off-site Copies"
      actions={
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <PlusIcon className="size-4" weight="bold" aria-hidden="true" />
          Add destination
        </Button>
      }
    >
      <p className="border-b border-line px-4 py-3 text-sm text-ink-muted">
        Send a copy of every backup somewhere{' '}
        <strong className="font-semibold text-ink">you</strong> control, so your data survives even
        if this server is lost. Telegram receives the backup file (up to {TELEGRAM_FILE_LIMIT_MB}{' '}
        MB, Telegram’s limit for bots); Email gets a message when each backup is ready.
      </p>
      {body}
      <AddDestinationDialog open={addOpen} onOpenChange={setAddOpen} />
    </BackupSection>
  )
}
