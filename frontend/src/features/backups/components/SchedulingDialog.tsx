import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { Dialog } from '@/components/ui/Dialog'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useBackupSchedule } from '../hooks/useBackupSchedule'
import { SchedulingForm } from './SchedulingForm'

type SchedulingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** The form mounts each time the dialog opens, so it always starts from the saved schedule. */
export function SchedulingDialog({ open, onOpenChange }: SchedulingDialogProps) {
  const schedule = useBackupSchedule()

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Automation & Scheduling">
      {schedule.isPending ? (
        <LoadingState label="Loading preferences" />
      ) : schedule.isError ? (
        <ErrorState
          title="Couldn’t load the preferences"
          description={getErrorMessage(schedule.error)}
          onRetry={() => void schedule.refetch()}
        />
      ) : (
        <SchedulingForm schedule={schedule.data} onDone={() => onOpenChange(false)} />
      )}
    </Dialog>
  )
}
