import { Badge } from '@/components/ui/Badge'
import { Table, type TableColumn } from '@/components/ui/Table'
import type { Backup } from '../types/backup.types'
import { formatBackupDate, formatFileSize } from '../utils/backupFormat'
import { BackupRowActions } from './BackupRowActions'

export function BackupTable({ backups }: { backups: Backup[] }) {
  const columns: TableColumn<Backup>[] = [
    {
      key: 'index',
      header: '#',
      cell: (row) => <span className="text-ink-muted">{backups.indexOf(row) + 1}</span>,
    },
    {
      key: 'createdAt',
      header: 'Date created',
      cell: (row) => <span className="whitespace-nowrap">{formatBackupDate(row.createdAt)}</span>,
    },
    {
      key: 'fileName',
      header: 'Filename',
      cell: (row) => <span className="font-mono text-[0.8125rem]">{row.fileName}</span>,
    },
    {
      key: 'origin',
      header: 'Type',
      cell: (row) => (
        <Badge tone={row.origin === 'scheduled' ? 'info' : 'neutral'}>
          {row.origin === 'scheduled' ? 'Scheduled' : 'Manual'}
        </Badge>
      ),
    },
    {
      key: 'size',
      header: 'Size',
      align: 'end',
      cell: (row) => <Badge className="whitespace-nowrap">{formatFileSize(row.sizeBytes)}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (row) => <BackupRowActions backup={row} />,
    },
  ]

  return (
    <Table
      caption="Available backups"
      hideCaption
      columns={columns}
      primaryKey="fileName"
      rows={backups}
      getRowKey={(row) => row.id}
      empty={null}
      bordered={false}
    />
  )
}
