import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import { ADMISSION_SETTINGS_LIMITS } from '../constants/admission-settings.constants'

export type AdmissionSettingsDocument = HydratedDocument<AdmissionSettings>

/** An uploaded image: where it is stored, and how to show it. */
@Schema({ _id: false })
export class UploadedAsset {
  @ApiProperty({ description: 'Storage key, used when the file is replaced or removed' })
  @Prop({ required: true })
  key: string

  @ApiProperty({ description: 'Address the browser loads it from' })
  @Prop({ required: true })
  url: string

  @ApiProperty({ description: 'The name of the file the school uploaded', example: 'upi-qr.png' })
  @Prop({ default: '' })
  originalName: string

  @ApiProperty({ example: 48213 })
  @Prop({ default: 0 })
  sizeInBytes: number

  @ApiProperty({ example: '2026-09-21T12:00:00.000Z' })
  @Prop({ type: Date, default: () => new Date() })
  uploadedAt: Date
}

export const UploadedAssetSchema = SchemaFactory.createForClass(UploadedAsset)

/**
 * How a school takes admissions: whether a fee is charged, how families pay it, and the address
 * the public application form will live at. Exactly one record, found by `singletonKey`.
 */
@Schema({ collection: 'admission_settings', timestamps: true, versionKey: false })
export class AdmissionSettings extends BaseSchema {
  @ApiProperty({ description: 'Fixed key that keeps this a single record', example: 'school' })
  @Prop({ required: true })
  singletonKey: string

  @ApiProperty({ description: 'Whether the school is taking applications at all', example: true })
  @Prop({ type: Boolean, default: false })
  admissionsOpen: boolean

  @ApiProperty({ description: 'Shown on the shareable card', example: '2026-27', maxLength: ADMISSION_SETTINGS_LIMITS.sessionLabelMax })
  @Prop({ type: String, default: '', trim: true, maxlength: ADMISSION_SETTINGS_LIMITS.sessionLabelMax })
  sessionLabel: string

  @ApiProperty({
    description: 'The public address families apply at, as the last part of the URL',
    example: 'green-valley',
    maxLength: ADMISSION_SETTINGS_LIMITS.slugMax,
  })
  @Prop({ type: String, default: '', trim: true, maxlength: ADMISSION_SETTINGS_LIMITS.slugMax })
  publicSlug: string

  @ApiProperty({ description: 'Whether applying costs money', example: false })
  @Prop({ type: Boolean, default: false })
  feeEnabled: boolean

  @ApiProperty({ description: 'What applying costs, in the school’s currency', example: 100 })
  @Prop({ type: Number, default: 0, min: 0, max: ADMISSION_SETTINGS_LIMITS.feeMax })
  feeAmount: number

  @ApiProperty({ description: 'A line families read next to the fee', example: 'Non-refundable', maxLength: ADMISSION_SETTINGS_LIMITS.noteMax })
  @Prop({ type: String, default: '', trim: true, maxlength: ADMISSION_SETTINGS_LIMITS.noteMax })
  feeNote: string

  @ApiProperty({ description: 'The UPI QR families scan to pay', type: UploadedAsset, nullable: true })
  @Prop({ type: UploadedAssetSchema, default: null })
  paymentQr: UploadedAsset | null

  @ApiProperty({ description: 'Who last changed these settings', nullable: true, type: String })
  @Prop({ type: String, default: null })
  updatedBy: string | null
}

export const AdmissionSettingsSchema = SchemaFactory.createForClass(AdmissionSettings)

AdmissionSettingsSchema.index({ singletonKey: 1 }, { unique: true, name: 'uniq_admission_settings' })
// The public page is found by this, so it has to be unique even though there is one school today.
AdmissionSettingsSchema.index(
  { publicSlug: 1 },
  { unique: true, name: 'uniq_admission_slug', partialFilterExpression: { publicSlug: { $gt: '' } } },
)
