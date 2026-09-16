import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useSystemSettings } from '../hooks/useSystemSettings'
import { SystemSettingsForm } from './SystemSettingsForm'

export function SystemSettingsPanel() {
  const settings = useSystemSettings()

  if (settings.isPending) return <LoadingState label="Loading system settings" />
  if (settings.isError) {
    return (
      <ErrorState
        title="Couldn’t load the system settings"
        description={getErrorMessage(settings.error)}
        onRetry={() => void settings.refetch()}
      />
    )
  }
  return <SystemSettingsForm settings={settings.data} />
}
