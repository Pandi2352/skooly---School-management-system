/** Branding image slots; the same list and order as the backend (modules/branding). */
export const BRANDING_ASSET_TYPES = [
  'logo',
  'favicon',
  'principalSignature',
  'schoolSeal',
  'loginBackground',
] as const

/** Brand colour presets; they match the app colour themes (app/theme/themeContext.ts). */
export const BRANDING_COLOR_THEMES = ['navy', 'blue'] as const

/** Text limits, matching the backend's UpdateBrandingDto. */
export const BRANDING_LIMITS = {
  displayNameMin: 2,
  displayNameMax: 80,
  shortNameMax: 12,
  taglineMax: 120,
  documentFooterMax: 200,
} as const

/** Preview box shape per slot: logos and seals square, the signature wide, the background a banner. */
export const ASSET_PREVIEW_SHAPES: Record<(typeof BRANDING_ASSET_TYPES)[number], 'square' | 'wide' | 'banner'> = {
  logo: 'square',
  favicon: 'square',
  principalSignature: 'wide',
  schoolSeal: 'square',
  loginBackground: 'banner',
}

/** Shown in the browser tab until the school uploads its own favicon. */
export const DEFAULT_FAVICON_HREF = '/skooly-logo.jpg'

/** Used in previews while the display name field is empty. */
export const PLACEHOLDER_SCHOOL_NAME = 'Your School Name'
