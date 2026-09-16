import { ClockIcon, PlusIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useCreateBackup } from '../hooks/useBackups'

export function BackupPageActions({ onOpenScheduling }: { onOpenScheduling: () => void }) {
  const { toast } = useToast()
  const createBackup = useCreateBackup()

  const create = async () => {
    try {
      const backup = await createBackup.mutateAsync()
      toast({
        title: 'Backup created',
        description: `${backup.fileName}. Sample data: it disappears when the page reloads.`,
      })
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t create a backup',
        description: getErrorMessage(error),
      })
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={onOpenScheduling}>
        <ClockIcon className="size-4.5" weight="fill" aria-hidden="true" />
        Scheduling Settings
      </Button>
      <Button loading={createBackup.isPending} onClick={() => void create()}>
        {!createBackup.isPending && (
          <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
        )}
        {createBackup.isPending ? 'Creating backup' : 'Create New Backup'}
      </Button>
    </>
  )
}
