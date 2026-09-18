export const BRANDING_ASSET_TYPES = ['logo', 'favicon', 'principalSignature', 'schoolSeal', 'loginBackground'] as const
export type BrandingAssetType = (typeof BRANDING_ASSET_TYPES)[number]

/** Brand colour presets; they match the frontend colour themes (frontend/src/app/theme). */
export const COLOR_THEMES = ['navy', 'blue'] as const
export type ColorTheme = (typeof COLOR_THEMES)[number]

const KB = 1024
const MB = 1024 * KB

export type BrandingAssetRule = {
  label: string
  description: string
  allowedMimeTypes: string[]
  maxBytes: number
  /** Raster images smaller than this are rejected; SVGs skip size checks because they scale. */
  minWidth: number
  minHeight: number
  recommendedWidth: number
  recommendedHeight: number
  /** Width and height must match (favicons and seals). */
  square: boolean
}

/**
 * Upload rules for each branding image. The frontend loads these from GET /branding/asset-rules,
 * so its hints and client-side checks always match what the server enforces.
 */
export const BRANDING_ASSET_RULES: Record<BrandingAssetType, BrandingAssetRule> = {
  logo: {
    label: 'School Logo',
    description: 'Shown in the app header, on the login page and on printed documents.',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    maxBytes: 2 * MB,
    minWidth: 128,
    minHeight: 128,
    recommendedWidth: 512,
    recommendedHeight: 512,
    square: false,
  },
  favicon: {
    label: 'Favicon',
    description: 'The small icon in browser tabs and bookmarks.',
    allowedMimeTypes: ['image/png', 'image/x-icon'],
    maxBytes: 512 * KB,
    minWidth: 32,
    minHeight: 32,
    recommendedWidth: 180,
    recommendedHeight: 180,
    square: true,
  },
  principalSignature: {
    label: 'Principal Signature',
    description: 'Printed on report cards, certificates and fee receipts.',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 1 * MB,
    minWidth: 200,
    minHeight: 60,
    recommendedWidth: 600,
    recommendedHeight: 200,
    square: false,
  },
  schoolSeal: {
    label: 'School Seal',
    description: 'The official stamp printed on certificates and ID cards.',
    allowedMimeTypes: ['image/png', 'image/webp', 'image/svg+xml'],
    maxBytes: 1 * MB,
    minWidth: 128,
    minHeight: 128,
    recommendedWidth: 512,
    recommendedHeight: 512,
    square: true,
  },
  loginBackground: {
    label: 'Login Background',
    description: 'The full-screen image behind the sign-in form.',
    allowedMimeTypes: ['image/jpeg', 'image/webp', 'image/png'],
    maxBytes: 5 * MB,
    minWidth: 1280,
    minHeight: 720,
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    square: false,
  },
}

/** Largest upload accepted at all (the biggest per-asset limit); multer stops reading beyond it. */
export const MAX_BRANDING_UPLOAD_BYTES = Math.max(...Object.values(BRANDING_ASSET_RULES).map((rule) => rule.maxBytes))

/** Refuse absurd image sizes that could exhaust memory when resized later. */
export const MAX_IMAGE_DIMENSION = 10_000

export const BRANDING_LIMITS = {
  displayNameMin: 2,
  displayNameMax: 80,
  shortNameMax: 12,
  taglineMax: 120,
  documentFooterMax: 200,
} as const

/** There is one branding record for the school; it's found by this key. */
export const BRANDING_SINGLETON_KEY = 'school'

/** Starting values for a new installation, all meant to be replaced on the Branding page. */
export const DEFAULT_BRANDING = {
  displayName: 'Your School Name',
  shortName: '',
  tagline: '',
  documentFooter: '',
  colorTheme: 'navy' as ColorTheme,
}

/** Matches the Branding page key in the frontend permission list (Settings & Billing → Branding). */
export const BRANDING_PERMISSIONS = {
  view: 'settings-and-billing.branding:view',
  edit: 'settings-and-billing.branding:edit',
} as const

export enum BrandingErrorCode {
  NO_CHANGES = 'BRANDING_NO_CHANGES',
  FILE_REQUIRED = 'BRANDING_FILE_REQUIRED',
  UNSUPPORTED_FILE = 'BRANDING_UNSUPPORTED_FILE',
  FILE_TOO_LARGE = 'BRANDING_FILE_TOO_LARGE',
  UNSAFE_SVG = 'BRANDING_UNSAFE_SVG',
  IMAGE_UNREADABLE = 'BRANDING_IMAGE_UNREADABLE',
  IMAGE_TOO_SMALL = 'BRANDING_IMAGE_TOO_SMALL',
  IMAGE_TOO_LARGE = 'BRANDING_IMAGE_TOO_LARGE',
  IMAGE_NOT_SQUARE = 'BRANDING_IMAGE_NOT_SQUARE',
  ASSET_NOT_SET = 'BRANDING_ASSET_NOT_SET',
}

/** Storage folder per asset, e.g. "branding/principal-signature". */
export const assetFolder = (type: BrandingAssetType) =>
  `branding/${type.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
