import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { generateUuid } from '../../common/utils/uuid.util'
import {
  BRANDING_ASSET_TYPES,
  BRANDING_SINGLETON_KEY,
  DEFAULT_BRANDING,
  type BrandingAssetType,
  type ColorTheme,
} from './constants/branding.constants'
import { Branding, BrandingDocument } from './schemas/branding.schema'

export type BrandingAssetRecord = {
  key: string
  originalName: string
  mimeType: string
  sizeBytes: number
  width: number | null
  height: number | null
  uploadedAt: Date
}

export type BrandingRecord = {
  _id: string
  displayName: string
  shortName: string
  tagline: string
  documentFooter: string
  colorTheme: ColorTheme
  assets: Partial<Record<BrandingAssetType, BrandingAssetRecord | null>>
  createdAt: Date
  updatedAt: Date
}

export type BrandingChanges = Partial<Pick<BrandingRecord, 'displayName' | 'shortName' | 'tagline' | 'documentFooter' | 'colorTheme'>>

const SINGLETON = { singletonKey: BRANDING_SINGLETON_KEY }

/** Database access for the single branding record. No business rules here. */
@Injectable()
export class BrandingRepository {
  constructor(@InjectModel(Branding.name) private readonly brandingModel: Model<BrandingDocument>) {}

  /** Creates the record with defaults if it doesn't exist; safe to call on every start. */
  async ensureExists(): Promise<void> {
    await this.brandingModel
      .updateOne(
        SINGLETON,
        {
          $setOnInsert: {
            _id: generateUuid(),
            ...SINGLETON,
            ...DEFAULT_BRANDING,
            assets: Object.fromEntries(BRANDING_ASSET_TYPES.map((type) => [type, null])),
          },
        },
        { upsert: true },
      )
      .exec()
  }

  find(): Promise<BrandingRecord | null> {
    return this.brandingModel.findOne(SINGLETON).lean<BrandingRecord>().exec()
  }

  update(changes: BrandingChanges): Promise<BrandingRecord | null> {
    return this.brandingModel
      .findOneAndUpdate(SINGLETON, { $set: changes }, { new: true, runValidators: true })
      .lean<BrandingRecord>()
      .exec()
  }

  /**
   * Sets one image slot (or clears it with null) in a single atomic update and returns the record
   * before and after, so the caller can delete the replaced file.
   */
  async setAsset(
    type: BrandingAssetType,
    asset: BrandingAssetRecord | null,
  ): Promise<{ previous: BrandingAssetRecord | null; updated: BrandingRecord | null }> {
    const before = await this.brandingModel
      .findOneAndUpdate(SINGLETON, { $set: { [`assets.${type}`]: asset } }, { new: false, runValidators: true })
      .lean<BrandingRecord>()
      .exec()
    if (!before) return { previous: null, updated: null }
    return { previous: before.assets[type] ?? null, updated: await this.find() }
  }
}
