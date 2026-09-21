import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { generateUuid } from '../../common/utils/uuid.util'
import { AdmissionSettings, AdmissionSettingsDocument, UploadedAsset } from './schemas/admission-settings.schema'

export type AdmissionSettingsRecord = {
  _id: string
  singletonKey: string
  admissionsOpen: boolean
  sessionLabel: string
  publicSlug: string
  feeEnabled: boolean
  feeAmount: number
  feeNote: string
  paymentQr: UploadedAsset | null
  updatedBy: string | null
  createdAt: Date
  updatedAt: Date
}

export type AdmissionSettingsChanges = Partial<
  Pick<
    AdmissionSettingsRecord,
    'admissionsOpen' | 'sessionLabel' | 'publicSlug' | 'feeEnabled' | 'feeAmount' | 'feeNote' | 'paymentQr' | 'updatedBy'
  >
>

const SINGLETON_KEY = 'school'

/** All database access for admission settings. Rules live in AdmissionSettingsService. */
@Injectable()
export class AdmissionSettingsRepository {
  constructor(
    @InjectModel(AdmissionSettings.name) private readonly settingsModel: Model<AdmissionSettingsDocument>,
  ) {}

  /**
   * The one record, created on first read. Upserting means a fresh install has settings to show
   * rather than an empty page that can't be saved.
   */
  async findOrCreate(): Promise<AdmissionSettingsRecord> {
    const existing = await this.settingsModel.findOne({ singletonKey: SINGLETON_KEY }).lean<AdmissionSettingsRecord>().exec()
    if (existing) return existing

    const created = await this.settingsModel.create({ _id: generateUuid(), singletonKey: SINGLETON_KEY })
    return created.toObject<AdmissionSettingsRecord>()
  }

  async update(changes: AdmissionSettingsChanges): Promise<AdmissionSettingsRecord | null> {
    return this.settingsModel
      .findOneAndUpdate({ singletonKey: SINGLETON_KEY }, { $set: changes }, { new: true, runValidators: true })
      .lean<AdmissionSettingsRecord>()
      .exec()
  }

  /** Brings indexes in line with the schema, dropping ones older versions created. */
  async syncIndexes(): Promise<void> {
    await this.settingsModel.syncIndexes()
  }
}
