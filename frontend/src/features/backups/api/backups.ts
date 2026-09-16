import { backupListSchema, backupSchema } from '../schemas/backup.schema'
import type { Backup } from '../types/backup.types'
import { addSampleBackup, readSampleBackups, removeSampleBackup } from './sample/sampleBackups'

// Short waits keep loading states visible, as they will be with the real API.
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** TODO(api): `api.get('/backups', backupListSchema)`. */
export async function getBackups(): Promise<Backup[]> {
  await Promise.resolve()
  return backupListSchema.parse(readSampleBackups())
}

/** TODO(api): `api.post('/backups', backupSchema)`. */
export async function createBackup(): Promise<Backup> {
  await wait(800)
  return backupSchema.parse(addSampleBackup(new Date()))
}

/** TODO(api): `api.delete(`/backups/${id}`)`. */
export async function deleteBackup(id: string): Promise<void> {
  await wait(300)
  removeSampleBackup(id)
}
