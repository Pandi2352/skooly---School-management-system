import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useIntegrationsSettings } from '../hooks/useIntegrationsSettings'
import { IntegrationsSettingsForm } from './IntegrationsSettingsForm'

export function IntegrationsSettingsPanel() {
  const query = useIntegrationsSettings()

  if (query.isPending) return <LoadingState label="Loading integrations settings" />
  if (query.isError) {
    return (
      <ErrorState
        title="Couldn’t load integrations settings"
        description={getErrorMessage(query.error)}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return <IntegrationsSettingsForm integrations={query.data} />
}
