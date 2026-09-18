import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useAttendanceSettings } from '../hooks/useAttendanceSettings'
import { AttendanceSettingsForm } from './AttendanceSettingsForm'

export function AttendanceSettingsPanel() {
  const query = useAttendanceSettings()

  if (query.isPending) return <LoadingState label="Loading attendance settings" />
  if (query.isError) {
    return (
      <ErrorState
        title="Couldn’t load attendance settings"
        description={getErrorMessage(query.error)}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return <AttendanceSettingsForm attendance={query.data} />
}
