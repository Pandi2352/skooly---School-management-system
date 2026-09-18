import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { BrandingEditor, useBranding } from '@/features/branding'
import { getErrorMessage } from '@/lib/api/getErrorMessage'

export function BrandingPanel() {
  const branding = useBranding()

  if (branding.isPending) return <LoadingState label="Loading branding" />
  if (branding.isError) {
    return (
      <ErrorState
        title="Couldn’t load branding"
        description={getErrorMessage(branding.error)}
        onRetry={() => void branding.refetch()}
      />
    )
  }

  return <BrandingEditor key={branding.data.id} branding={branding.data} />
}
