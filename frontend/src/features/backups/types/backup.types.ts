import type { z } from 'zod'
import type { BACKUP_VIEWS, DESTINATION_CHANNELS } from '../constants'
import type {
  backupScheduleSchema,
  backupSchema,
  destinationFormSchema,
  destinationInputSchema,
  destinationSchema,
} from '../schemas/backup.schema'

export type Backup = z.infer<typeof backupSchema>
export type Destination = z.infer<typeof destinationSchema>
export type DestinationInput = z.infer<typeof destinationInputSchema>
export type DestinationFormValues = z.infer<typeof destinationFormSchema>
export type BackupSchedule = z.infer<typeof backupScheduleSchema>
export type DestinationChannel = (typeof DESTINATION_CHANNELS)[number]
export type BackupView = (typeof BACKUP_VIEWS)[number]
