import type {
  BackupSchedule,
  Destination,
  DestinationFormValues,
  DestinationInput,
} from '../types/backup.types'

const pad = (value: number) => String(value).padStart(2, '0')

const dateParts = (date: Date) => ({
  day: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
  time: [date.getHours(), date.getMinutes(), date.getSeconds()].map(pad),
})

/** "2026-09-01 06:57:36", in the viewer's local time. */
export function formatBackupDate(isoDate: string) {
  const { day, time } = dateParts(new Date(isoDate))
  return `${day} ${time.join(':')}`
}

/** "backup-2026-09-01-06-57-36.zip" */
export function backupFileName(date: Date) {
  const { day, time } = dateParts(date)
  return `backup-${day}-${time.join('-')}.zip`
}

export function formatFileSize(bytes: number) {
  const megabytes = bytes / (1024 * 1024)
  return megabytes >= 1
    ? `${megabytes.toFixed(2)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export const formatBackupCount = (count: number) => (count === 1 ? '1 backup' : `${count} backups`)

export function formatScheduleNotice(schedule: BackupSchedule) {
  return schedule.scheduledBackups.enabled
    ? `A backup is created automatically every night at ${schedule.scheduledBackups.time}. You can also create one at any time with Create New Backup.`
    : 'Scheduled backups are off. Turn them on in Scheduling Settings, or create a backup at any time with Create New Backup.'
}

/** Keeps only the fields of the chosen channel. */
export function toDestinationInput(values: DestinationFormValues): DestinationInput {
  return values.channel === 'telegram'
    ? {
        channel: 'telegram',
        label: values.label.trim(),
        botToken: values.botToken.trim(),
        chatId: values.chatId.trim(),
      }
    : { channel: 'email', label: values.label.trim(), email: values.email.trim() }
}

export const describeDestination = (destination: Destination) =>
  destination.channel === 'telegram' ? `Chat ID ${destination.chatId}` : destination.email
