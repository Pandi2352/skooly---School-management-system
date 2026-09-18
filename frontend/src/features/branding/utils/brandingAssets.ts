import type { BrandingAsset, BrandingAssetRule } from '../types/branding.types'

const TYPE_NAMES: Record<string, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/webp': 'WebP',
  'image/svg+xml': 'SVG',
  'image/x-icon': 'ICO',
}

export const allowedTypeNames = (rule: BrandingAssetRule) =>
  rule.allowedMimeTypes.map((type) => TYPE_NAMES[type] ?? type).join(', ')

export function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${String(Math.round((bytes / (1024 * 1024)) * 10) / 10)} MB`
  return `${String(Math.max(1, Math.round(bytes / 1024)))} KB`
}

/** Browsers name some types differently (ICO especially), so compare against one spelling. */
export function normalizeFileType(file: { type: string; name: string }) {
  if (file.type === 'image/vnd.microsoft.icon' || (file.type === '' && /\.ico$/i.test(file.name))) return 'image/x-icon'
  if (file.type === 'image/jpg') return 'image/jpeg'
  return file.type
}

/** The file picker's accept list, including the alternative ICO spellings browsers use. */
export function acceptAttribute(rule: BrandingAssetRule) {
  const extras = rule.allowedMimeTypes.includes('image/x-icon') ? ['image/vnd.microsoft.icon', '.ico'] : []
  return [...rule.allowedMimeTypes, ...extras].join(',')
}

/**
 * Type and size check before uploading, so obvious mistakes don't wait for the network.
 * The server checks again from the real file contents; this only saves a round trip.
 */
export function checkAssetFile(file: { type: string; name: string; size: number }, rule: BrandingAssetRule) {
  if (!rule.allowedMimeTypes.includes(normalizeFileType(file))) {
    return `${rule.label} must be a ${allowedTypeNames(rule)} image.`
  }
  if (file.size > rule.maxBytes) {
    return `${rule.label} must be ${formatBytes(rule.maxBytes)} or smaller; this file is ${formatBytes(file.size)}.`
  }
  return null
}

/** Pixel-size check for raster images; SVGs scale, so they always pass. */
export function checkAssetDimensions(
  size: { width: number; height: number },
  rule: BrandingAssetRule,
  mimeType: string,
) {
  if (mimeType === 'image/svg+xml') return null
  if (size.width < rule.minWidth || size.height < rule.minHeight) {
    return `${rule.label} is ${String(size.width)}×${String(size.height)} pixels; use at least ${String(rule.minWidth)}×${String(rule.minHeight)}.`
  }
  if (rule.square && size.width !== size.height) {
    return `${rule.label} must be square; this one is ${String(size.width)}×${String(size.height)} pixels.`
  }
  return null
}

/** Short requirement labels for a slot, e.g. ["PNG, ICO", "Up to 512 KB", "Best 180×180 px", "Square"]. */
export function describeRule(rule: BrandingAssetRule) {
  return [
    allowedTypeNames(rule),
    `Up to ${formatBytes(rule.maxBytes)}`,
    `Best ${String(rule.recommendedWidth)}×${String(rule.recommendedHeight)} px`,
    ...(rule.square ? ['Square'] : []),
  ]
}

/** "school-logo.png · 48 KB · 512×512 px" */
export function describeAsset(asset: BrandingAsset) {
  const size = asset.width !== null && asset.height !== null ? ` · ${String(asset.width)}×${String(asset.height)} px` : ''
  return `${asset.originalName} · ${formatBytes(asset.sizeBytes)}${size}`
}

/** Up to two letters for a logo placeholder: "Green Valley Public School" → "GV". */
export function schoolInitials(name: string) {
  const words = name.trim().split(/\s+/).filter((word) => /^[\p{L}\p{N}]/u.test(word))
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}
