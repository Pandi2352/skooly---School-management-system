import { api } from '@/lib/api/client'
import { brandingAssetRuleListSchema, brandingSchema } from '../schemas/branding.schema'
import type {
  Branding,
  BrandingAssetRule,
  BrandingAssetType,
  BrandingChanges,
} from '../types/branding.types'
import {
  readSampleBranding,
  sampleBrandingAssetRules,
  setSampleBrandingAsset,
  updateSampleBranding,
} from './sample/sampleBranding'

// Tests run without a backend, so they use the labelled sample data instead.
const isTestMode = import.meta.env.MODE === 'test'

export async function getBranding(): Promise<Branding> {
  if (isTestMode) return brandingSchema.parse(readSampleBranding())
  return api.get('/branding', brandingSchema)
}

export async function getBrandingAssetRules(): Promise<BrandingAssetRule[]> {
  if (isTestMode) return brandingAssetRuleListSchema.parse(sampleBrandingAssetRules)
  return api.get('/branding/asset-rules', brandingAssetRuleListSchema)
}

export async function updateBranding(changes: BrandingChanges): Promise<Branding> {
  if (isTestMode) return brandingSchema.parse(updateSampleBranding(changes))
  return api.patch('/branding', brandingSchema, changes)
}

export async function uploadBrandingAsset({ type, file }: { type: BrandingAssetType; file: File }): Promise<Branding> {
  if (isTestMode) return brandingSchema.parse(setSampleBrandingAsset(type, file))
  const formData = new FormData()
  formData.append('file', file)
  return api.upload(`/branding/assets/${type}`, brandingSchema, formData, { method: 'PUT' })
}

export async function removeBrandingAsset(type: BrandingAssetType): Promise<Branding> {
  if (isTestMode) return brandingSchema.parse(setSampleBrandingAsset(type, null))
  return api.delete(`/branding/assets/${type}`, brandingSchema)
}
