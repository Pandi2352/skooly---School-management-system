import { ImagesIcon } from '@phosphor-icons/react'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useBrandingAssetRules } from '../hooks/useBranding'
import type { Branding } from '../types/branding.types'
import { BrandingAssetCard } from './BrandingAssetCard'

/** The five branding images. Rules come from the server, so hints always match what it accepts. */
export function BrandingAssetsSection({ branding }: { branding: Branding }) {
  const rules = useBrandingAssetRules()

  return (
    <section aria-labelledby="branding-images" className="grid gap-4 rounded-md border border-line bg-surface p-4 @xl:p-5">
      <SectionHeading id="branding-images" icon={ImagesIcon}>
        Images
      </SectionHeading>
      <p className="text-sm text-ink-muted">
        Each image saves as soon as it’s uploaded. Use PNGs with transparent backgrounds for the logo and seal, so they
        look right on light and dark screens.
      </p>
      {rules.isPending ? (
        <LoadingState label="Loading image rules" />
      ) : rules.isError ? (
        <ErrorState
          title="Couldn’t load the image rules"
          description={getErrorMessage(rules.error)}
          onRetry={() => void rules.refetch()}
        />
      ) : (
        <div className="grid gap-4 @2xl:grid-cols-2">
          {rules.data.map((rule) => (
            <BrandingAssetCard key={rule.type} rule={rule} asset={branding.assets[rule.type]} />
          ))}
        </div>
      )}
    </section>
  )
}
