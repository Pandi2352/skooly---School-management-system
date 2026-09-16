import { backupScheduleSchema } from '../schemas/backup.schema'
import type { BackupSchedule } from '../types/backup.types'
import { readSampleSchedule, writeSampleSchedule } from './sample/sampleBackups'

/** TODO(api): `api.get('/backups/schedule', backupScheduleSchema)`. */
export async function getBackupSchedule(): Promise<BackupSchedule> {
  await Promise.resolve()
  return backupScheduleSchema.parse(readSampleSchedule())
}

/** TODO(api): `api.put('/backups/schedule', backupScheduleSchema, values)`. */
export async function updateBackupSchedule(values: BackupSchedule): Promise<BackupSchedule> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return backupScheduleSchema.parse(writeSampleSchedule(backupScheduleSchema.parse(values)))
}
