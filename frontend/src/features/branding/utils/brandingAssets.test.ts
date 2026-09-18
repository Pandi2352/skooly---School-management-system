import { describe, expect, it } from 'vitest'
import { sampleBrandingAssetRules } from '../api/sample/sampleBranding'
import type { BrandingAssetRule, BrandingAssetType } from '../types/branding.types'
import {
  acceptAttribute,
  checkAssetDimensions,
  checkAssetFile,
  describeAsset,
  describeRule,
  formatBytes,
  normalizeFileType,
  schoolInitials,
} from './brandingAssets'

function rule(type: BrandingAssetType): BrandingAssetRule {
  const found = sampleBrandingAssetRules.find((item) => item.type === type)
  if (!found) throw new Error(`No sample rule for ${type}`)
  return found
}

describe('branding asset checks', () => {
  it('accepts allowed types within the size limit', () => {
    expect(checkAssetFile({ type: 'image/png', name: 'logo.png', size: 1000 }, rule('logo'))).toBeNull()
    expect(checkAssetFile({ type: '', name: 'favicon.ico', size: 1000 }, rule('favicon'))).toBeNull()
    expect(normalizeFileType({ type: 'image/vnd.microsoft.icon', name: 'x' })).toBe('image/x-icon')
  })

  it('explains wrong types and oversized files', () => {
    expect(checkAssetFile({ type: 'image/gif', name: 'logo.gif', size: 10 }, rule('logo'))).toBe(
      'School Logo must be a PNG, JPG, WebP, SVG image.',
    )
    expect(checkAssetFile({ type: 'image/png', name: 'f.png', size: 600 * 1024 }, rule('favicon'))).toBe(
      'Favicon must be 512 KB or smaller; this file is 600 KB.',
    )
  })

  it('checks minimum and square sizes but lets SVGs through', () => {
    expect(checkAssetDimensions({ width: 64, height: 64 }, rule('logo'), 'image/png')).toMatch(/at least 128×128/)
    expect(checkAssetDimensions({ width: 64, height: 32 }, rule('favicon'), 'image/png')).toMatch(/must be square/)
    expect(checkAssetDimensions({ width: 10, height: 10 }, rule('logo'), 'image/svg+xml')).toBeNull()
  })

  it('describes rules and uploaded files', () => {
    expect(describeRule(rule('favicon'))).toEqual(['PNG, ICO', 'Up to 512 KB', 'Best 180×180 px', 'Square'])
    expect(acceptAttribute(rule('favicon'))).toContain('.ico')
    expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.5 MB')
    expect(
      describeAsset({
        type: 'logo',
        url: 'x',
        originalName: 'logo.png',
        mimeType: 'image/png',
        sizeBytes: 48 * 1024,
        width: 512,
        height: 512,
        uploadedAt: '2026-09-16T12:00:00.000Z',
      }),
    ).toBe('logo.png · 48 KB · 512×512 px')
  })

  it('makes initials for the logo placeholder', () => {
    expect(schoolInitials('  Green Valley Public School ')).toBe('GV')
    expect(schoolInitials('')).toBe('')
  })
})
