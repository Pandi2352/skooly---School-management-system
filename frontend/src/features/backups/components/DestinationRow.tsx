import { EnvelopeSimpleIcon, TelegramLogoIcon, TrashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { CHANNEL_OPTIONS } from '../constants'
import { useRemoveDestination } from '../hooks/useDestinations'
import type { Destination } from '../types/backup.types'
import { describeDestination } from '../utils/backupFormat'

export function DestinationRow({ destination }: { destination: Destination }) {
  const { toast } = useToast()
  const removeDestination = useRemoveDestination()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const ChannelIcon = destination.channel === 'telegram' ? TelegramLogoIcon : EnvelopeSimpleIcon
  const channelLabel =
    CHANNEL_OPTIONS.find((option) => option.value === destination.channel)?.label ??
    destination.channel

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className="grid size-10 flex-none place-items-center rounded-full bg-primary/10 text-primary">
        <ChannelIcon className="size-5" weight="fill" aria-hidden="true" />
      </span>
      <div className="grid min-w-0 flex-1 gap-0.5">
        <p className="truncate font-semibold">{destination.label}</p>
        <p className="truncate text-sm text-ink-muted">{describeDestination(destination)}</p>
      </div>
      <Badge tone="info">{channelLabel}</Badge>
      <Tooltip content="Remove">
        <IconButton
          size="sm"
          icon={TrashIcon}
          label={`Remove ${destination.label}`}
          className="hover:text-danger"
          onClick={() => setConfirmOpen(true)}
        />
      </Tooltip>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove ${destination.label}?`}
        description="New backups won’t be sent here any more. Copies already sent stay where they are."
        confirmLabel="Remove destination"
        onConfirm={async () => {
          try {
            await removeDestination.mutateAsync(destination.id)
            toast({ title: 'Destination removed', description: destination.label })
          } catch (error) {
            toast({
              tone: 'error',
              title: 'Couldn’t remove the destination',
              description: getErrorMessage(error),
            })
          }
        }}
      />
    </li>
  )
}
