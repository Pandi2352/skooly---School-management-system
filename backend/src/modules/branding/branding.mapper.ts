import type { FileStorage } from '../../common/storage/file-storage.interface'
import { BRANDING_ASSET_RULES, BRANDING_ASSET_TYPES } from './constants/branding.constants'
import type {
  BrandingAssetResponseDto,
  BrandingAssetRuleResponseDto,
  BrandingAssetsResponseDto,
  BrandingResponseDto,
} from './dto/branding-response.dto'
import type { BrandingRecord } from './branding.repository'

/** Public shape: `id` instead of `_id`, file URLs instead of storage keys, ISO dates. */
export function toBrandingResponse(record: BrandingRecord, storage: FileStorage): BrandingResponseDto {
  const assets = Object.fromEntries(
    BRANDING_ASSET_TYPES.map((type): [string, BrandingAssetResponseDto | null] => {
      const asset = record.assets[type]
      return [
        type,
        asset
          ? {
              type,
              url: storage.publicUrl(asset.key),
              originalName: asset.originalName,
              mimeType: asset.mimeType,
              sizeBytes: asset.sizeBytes,
              width: asset.width ?? null,
              height: asset.height ?? null,
              uploadedAt: new Date(asset.uploadedAt).toISOString(),
            }
          : null,
      ]
    }),
  ) as unknown as BrandingAssetsResponseDto

  return {
    id: record._id,
    displayName: record.displayName,
    shortName: record.shortName ?? '',
    tagline: record.tagline ?? '',
    documentFooter: record.documentFooter ?? '',
    colorTheme: record.colorTheme,
    assets,
    updatedAt: new Date(record.updatedAt).toISOString(),
  }
}

export function toAssetRuleResponses(): BrandingAssetRuleResponseDto[] {
  return BRANDING_ASSET_TYPES.map((type) => ({ type, ...BRANDING_ASSET_RULES[type] }))
}
