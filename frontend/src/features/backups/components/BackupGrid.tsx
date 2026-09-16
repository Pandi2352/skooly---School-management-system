import { FileZipIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import type { Backup } from '../types/backup.types'
import { formatBackupDate, formatFileSize } from '../utils/backupFormat'
import { BackupRowActions } from './BackupRowActions'

export function BackupGrid({ backups }: { backups: Backup[] }) {
  return (
    <ul className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
      {backups.map((backup) => (
        <li
          key={backup.id}
          className="grid content-start gap-3 rounded-md border border-line bg-surface p-4 hover:border-control"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-10 flex-none place-items-center rounded-md bg-primary/10 text-primary">
              <FileZipIcon className="size-5.5" weight="fill" aria-hidden="true" />
            </span>
            <div className="grid min-w-0 gap-0.5">
              <p className="font-mono text-[0.8125rem] font-semibold break-all">
                {backup.fileName}
              </p>
              <p className="text-sm text-ink-muted">{formatBackupDate(backup.createdAt)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <Badge tone={backup.origin === 'scheduled' ? 'info' : 'neutral'}>
                {backup.origin === 'scheduled' ? 'Scheduled' : 'Manual'}
              </Badge>
              <Badge>{formatFileSize(backup.sizeBytes)}</Badge>
            </div>
            <BackupRowActions backup={backup} />
          </div>
        </li>
      ))}
    </ul>
  )
}
