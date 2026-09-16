import type {
  Backup,
  BackupSchedule,
  Destination,
  DestinationInput,
} from '../../types/backup.types'
import { backupFileName } from '../../utils/backupFormat'

// SAMPLE DATA: placeholder backups, destinations and schedule until the backup API exists
// (antislop R-38). Changes only update these in-memory copies, which reset on reload; every
// success message says so. Sample backups have no real file behind them.

let backups: Backup[] = [
  {
    id: 'sample-backup-2',
    createdAt: '2026-09-01T06:57:36',
    fileName: 'backup-2026-09-01-06-57-36.zip',
    sizeBytes: 21_758_771,
    origin: 'scheduled',
  },
  {
    id: 'sample-backup-1',
    createdAt: '2026-08-04T07:48:49',
    fileName: 'backup-2026-08-04-07-48-49.zip',
    sizeBytes: 19_832_995,
    origin: 'manual',
  },
]

let destinations: Destination[] = []

let schedule: BackupSchedule = {
  dailySummary: { enabled: false, time: '08:00', channels: ['email'] },
  scheduledBackups: { enabled: false, time: '02:00' },
}

export const readSampleBackups = () => backups

export function addSampleBackup(date: Date): Backup {
  const backup: Backup = {
    id: `sample-backup-${date.getTime()}`,
    createdAt: date.toISOString(),
    fileName: backupFileName(date),
    // Reuses the latest sample size; a real backup reports its own.
    sizeBytes: backups[0]?.sizeBytes ?? 20 * 1024 * 1024,
    origin: 'manual',
  }
  backups = [backup, ...backups]
  return backup
}

export function removeSampleBackup(id: string) {
  backups = backups.filter((backup) => backup.id !== id)
}

export const readSampleDestinations = () => destinations

export function addSampleDestination(input: DestinationInput): Destination {
  const id = `sample-destination-${Date.now()}`
  // The bot token is kept out of what the list returns, as the real API will.
  const destination: Destination =
    input.channel === 'telegram'
      ? { id, channel: 'telegram', label: input.label, chatId: input.chatId }
      : { id, channel: 'email', label: input.label, email: input.email }
  destinations = [...destinations, destination]
  return destination
}

export function removeSampleDestination(id: string) {
  destinations = destinations.filter((destination) => destination.id !== id)
}

export const readSampleSchedule = () => schedule

export function writeSampleSchedule(next: BackupSchedule) {
  schedule = next
  return schedule
}
