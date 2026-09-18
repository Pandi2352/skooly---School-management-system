import type { z } from 'zod'
import type { BRANDING_ASSET_TYPES } from '../constants'
import type {
  brandingAssetRuleSchema,
  brandingAssetSchema,
  brandingIdentitySchema,
  brandingSchema,
} from '../schemas/branding.schema'

export type Branding = z.infer<typeof brandingSchema>
export type BrandingAsset = z.infer<typeof brandingAssetSchema>
export type BrandingAssetRule = z.infer<typeof brandingAssetRuleSchema>
export type BrandingAssetType = (typeof BRANDING_ASSET_TYPES)[number]
export type BrandingIdentityValues = z.infer<typeof brandingIdentitySchema>

/** Fields PATCH /branding accepts; send only what changed. */
export type BrandingChanges = Partial<BrandingIdentityValues & { colorTheme: Branding['colorTheme'] }>
