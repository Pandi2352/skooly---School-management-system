import { Alert } from '@/components/ui/Alert'
import { useBackupSchedule } from '../hooks/useBackupSchedule'
import { formatScheduleNotice } from '../utils/backupFormat'

/** Says whether nightly backups are on, from the saved schedule. */
export function BackupScheduleNotice() {
  const schedule = useBackupSchedule()
  if (!schedule.isSuccess) return null
  return <Alert title={formatScheduleNotice(schedule.data)} />
}
