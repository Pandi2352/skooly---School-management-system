import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useSecuritySettings } from '../hooks/useSecuritySettings'
import { SecuritySettingsForm } from './SecuritySettingsForm'

export function SecuritySettingsPanel() {
  const query = useSecuritySettings()

  if (query.isPending) return <LoadingState label="Loading security settings" />
  if (query.isError) {
    return (
      <ErrorState
        title="Couldn’t load security settings"
        description={getErrorMessage(query.error)}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return <SecuritySettingsForm security={query.data} />
}
