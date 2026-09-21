import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { AdmissionSettingsEditor } from '../components/AdmissionSettingsEditor'
import { useAdmissionSettings } from '../hooks/useAdmissionSettings'

export function AdmissionSettingsPage() {
  const settings = useAdmissionSettings()

  return (
    <PageContainer
      title="Admission Settings"
      description="Whether the school is taking applications, what applying costs, and the address the public form will use."
      fullWidth
    >
      {settings.isPending ? (
        <LoadingState label="Loading admission settings" />
      ) : settings.isError ? (
        <ErrorState
          title="Couldn’t load admission settings"
          description={getErrorMessage(settings.error)}
          onRetry={() => void settings.refetch()}
        />
      ) : (
        // Remounting when the QR changes keeps the fee switch in step with what the server allows.
        <AdmissionSettingsEditor
          key={settings.data.paymentQr?.url ?? 'no-qr'}
          settings={settings.data}
        />
      )}
    </PageContainer>
  )
}
