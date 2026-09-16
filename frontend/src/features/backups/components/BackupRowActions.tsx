import { DownloadSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useDeleteBackup } from '../hooks/useBackups'
import type { Backup } from '../types/backup.types'

export function BackupRowActions({ backup }: { backup: Backup }) {
  const { toast } = useToast()
  const deleteBackup = useDeleteBackup()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex justify-end gap-1">
      <Tooltip content="Download">
        <IconButton
          size="sm"
          icon={DownloadSimpleIcon}
          label={`Download ${backup.fileName}`}
          onClick={() =>
            toast({
              title: 'Download not available yet',
              description:
                'Sample backups have no file. Downloads work once the backup API is connected.',
            })
          }
        />
      </Tooltip>
      <Tooltip content="Delete">
        <IconButton
          size="sm"
          icon={TrashIcon}
          label={`Delete ${backup.fileName}`}
          className="hover:text-danger"
          onClick={() => setConfirmOpen(true)}
        />
      </Tooltip>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this backup?"
        description={`${backup.fileName} will be removed for good, and school data can’t be restored from it.`}
        confirmLabel="Delete backup"
        onConfirm={async () => {
          try {
            await deleteBackup.mutateAsync(backup.id)
            toast({ title: 'Backup deleted', description: backup.fileName })
          } catch (error) {
            toast({
              tone: 'error',
              title: 'Couldn’t delete the backup',
              description: getErrorMessage(error),
            })
          }
        }}
      />
    </div>
  )
}
