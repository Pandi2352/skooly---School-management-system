import type {
  Branding,
  BrandingAssetRule,
  BrandingAssetType,
  BrandingChanges,
} from '../../types/branding.types'

// SAMPLE DATA: used only by tests (MODE === 'test'); the app talks to the backend branding API.
// Values are placeholders, and the rules mirror backend/src/modules/branding/constants.

const KB = 1024
const MB = 1024 * KB

export const sampleBrandingAssetRules: BrandingAssetRule[] = [
  { type: 'logo', label: 'School Logo', description: 'Shown in the app header, on the login page and on printed documents.', allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'], maxBytes: 2 * MB, minWidth: 128, minHeight: 128, recommendedWidth: 512, recommendedHeight: 512, square: false },
  { type: 'favicon', label: 'Favicon', description: 'The small icon in browser tabs and bookmarks.', allowedMimeTypes: ['image/png', 'image/x-icon'], maxBytes: 512 * KB, minWidth: 32, minHeight: 32, recommendedWidth: 180, recommendedHeight: 180, square: true },
  { type: 'principalSignature', label: 'Principal Signature', description: 'Printed on report cards, certificates and fee receipts.', allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'], maxBytes: 1 * MB, minWidth: 200, minHeight: 60, recommendedWidth: 600, recommendedHeight: 200, square: false },
  { type: 'schoolSeal', label: 'School Seal', description: 'The official stamp printed on certificates and ID cards.', allowedMimeTypes: ['image/png', 'image/webp', 'image/svg+xml'], maxBytes: 1 * MB, minWidth: 128, minHeight: 128, recommendedWidth: 512, recommendedHeight: 512, square: true },
  { type: 'loginBackground', label: 'Login Background', description: 'The full-screen image behind the sign-in form.', allowedMimeTypes: ['image/jpeg', 'image/webp', 'image/png'], maxBytes: 5 * MB, minWidth: 1280, minHeight: 720, recommendedWidth: 1920, recommendedHeight: 1080, square: false },
]

let branding: Branding = {
  id: '6f1d2c3b-4a5e-4f60-9b7a-8c9d0e1f2a3b',
  displayName: 'Sample Public School',
  shortName: 'SPS',
  tagline: '',
  documentFooter: '',
  colorTheme: 'navy',
  assets: { logo: null, favicon: null, principalSignature: null, schoolSeal: null, loginBackground: null },
  updatedAt: '2026-09-16T12:00:00.000Z',
}

export const readSampleBranding = () => branding

export function updateSampleBranding(changes: BrandingChanges): Branding {
  branding = { ...branding, ...changes, updatedAt: new Date().toISOString() }
  return branding
}

export function setSampleBrandingAsset(type: BrandingAssetType, file: File | null): Branding {
  const now = new Date().toISOString()
  branding = {
    ...branding,
    assets: {
      ...branding.assets,
      [type]: file
        ? { type, url: `sample://branding/${type}/${file.name}`, originalName: file.name, mimeType: file.type, sizeBytes: file.size, width: null, height: null, uploadedAt: now }
        : null,
    },
    updatedAt: now,
  }
  return branding
}
