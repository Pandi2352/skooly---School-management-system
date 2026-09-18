import { z } from 'zod'
import { BRANDING_ASSET_TYPES, BRANDING_COLOR_THEMES, BRANDING_LIMITS } from '../constants'

// Response shapes of the backend branding API (GET /branding, GET /branding/asset-rules).

export const brandingAssetSchema = z.object({
  type: z.enum(BRANDING_ASSET_TYPES),
  url: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  uploadedAt: z.string(),
})

export const brandingSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  shortName: z.string(),
  tagline: z.string(),
  documentFooter: z.string(),
  colorTheme: z.enum(BRANDING_COLOR_THEMES),
  assets: z.object({
    logo: brandingAssetSchema.nullable(),
    favicon: brandingAssetSchema.nullable(),
    principalSignature: brandingAssetSchema.nullable(),
    schoolSeal: brandingAssetSchema.nullable(),
    loginBackground: brandingAssetSchema.nullable(),
  }),
  updatedAt: z.string(),
})

export const brandingAssetRuleSchema = z.object({
  type: z.enum(BRANDING_ASSET_TYPES),
  label: z.string(),
  description: z.string(),
  allowedMimeTypes: z.array(z.string()),
  maxBytes: z.number().int().positive(),
  minWidth: z.number().int().nonnegative(),
  minHeight: z.number().int().nonnegative(),
  recommendedWidth: z.number().int().positive(),
  recommendedHeight: z.number().int().positive(),
  square: z.boolean(),
})

export const brandingAssetRuleListSchema = z.array(brandingAssetRuleSchema)

const tooLong = (max: number) => `Use ${String(max)} characters or fewer`

/** The name and wording form on the Branding page. */
export const brandingIdentitySchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(BRANDING_LIMITS.displayNameMin, 'Enter the school’s name, like Green Valley Public School')
    .max(BRANDING_LIMITS.displayNameMax, tooLong(BRANDING_LIMITS.displayNameMax)),
  shortName: z.string().trim().max(BRANDING_LIMITS.shortNameMax, tooLong(BRANDING_LIMITS.shortNameMax)),
  tagline: z.string().trim().max(BRANDING_LIMITS.taglineMax, tooLong(BRANDING_LIMITS.taglineMax)),
  documentFooter: z.string().trim().max(BRANDING_LIMITS.documentFooterMax, tooLong(BRANDING_LIMITS.documentFooterMax)),
})
