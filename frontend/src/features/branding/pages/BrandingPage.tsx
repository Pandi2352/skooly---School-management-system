import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { BrandingEditor } from '../components/BrandingEditor'
import { useBranding } from '../hooks/useBranding'

export function BrandingPage() {
  const branding = useBranding()

  return (
    <PageContainer
      title="Branding"
      description="The school’s name, colour and images across the app, the login page and printed documents."
      fullWidth
    >
      {branding.isPending ? (
        <LoadingState label="Loading branding" />
      ) : branding.isError ? (
        <ErrorState
          title="Couldn’t load branding"
          description={getErrorMessage(branding.error)}
          onRetry={() => void branding.refetch()}
        />
      ) : (
        <BrandingEditor key={branding.data.id} branding={branding.data} />
      )}
    </PageContainer>
  )
}
