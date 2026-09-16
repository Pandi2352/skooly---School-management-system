import { DatabaseIcon, ListBulletsIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { EmptyState } from '@/components/page/EmptyState'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { ViewToggle, type ViewOption } from '@/components/ui/ViewToggle'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useBackups } from '../hooks/useBackups'
import { useBackupView } from '../hooks/useBackupView'
import type { BackupView } from '../types/backup.types'
import { formatBackupCount } from '../utils/backupFormat'
import { BackupGrid } from './BackupGrid'
import { BackupSection } from './BackupSection'
import { BackupTable } from './BackupTable'

const viewOptions: ViewOption<BackupView>[] = [
  { value: 'list', label: 'Table view', icon: ListBulletsIcon },
  { value: 'grid', label: 'Card view', icon: SquaresFourIcon },
]

export function BackupListCard() {
  const backups = useBackups()
  const { view, setView } = useBackupView()

  let body
  if (backups.isPending) body = <LoadingState label="Loading backups" />
  else if (backups.isError) {
    body = (
      <ErrorState
        title="Couldn’t load backups"
        description={getErrorMessage(backups.error)}
        onRetry={() => void backups.refetch()}
      />
    )
  } else if (backups.data.length === 0) {
    body = (
      <EmptyState
        icon={DatabaseIcon}
        title="No backups yet"
        description="Create a backup now, or turn on nightly backups in Scheduling Settings."
      />
    )
  } else if (view === 'grid') body = <BackupGrid backups={backups.data} />
  else body = <BackupTable backups={backups.data} />

  return (
    <BackupSection
      id="available-backups"
      icon={DatabaseIcon}
      title="Available Backups"
      actions={
        <>
          {backups.isSuccess && (
            <span className="text-sm text-ink-muted">{formatBackupCount(backups.data.length)}</span>
          )}
          <ViewToggle value={view} onChange={setView} options={viewOptions} />
        </>
      }
    >
      {body}
    </BackupSection>
  )
}
