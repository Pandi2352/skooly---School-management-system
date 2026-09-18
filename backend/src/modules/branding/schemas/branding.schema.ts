import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import { BRANDING_LIMITS, COLOR_THEMES, type ColorTheme } from '../constants/branding.constants'

/** An uploaded branding image. The file lives in FILE_STORAGE; only its key is stored here. */
@Schema({ _id: false })
export class BrandingAsset {
  @ApiProperty({ description: 'Storage key of the file (not a URL)', example: 'branding/logo/3f2b8c1e-9a4d-4c7e-8b21-5d6f0a9e1c34.png' })
  @Prop({ required: true })
  key: string

  @ApiProperty({ description: 'File name as uploaded, cleaned for display', example: 'school-logo.png' })
  @Prop({ required: true })
  originalName: string

  @ApiProperty({ description: 'Type detected from the file contents', example: 'image/png' })
  @Prop({ required: true })
  mimeType: string

  @ApiProperty({ description: 'File size in bytes', example: 48213 })
  @Prop({ required: true, min: 0 })
  sizeBytes: number

  @ApiProperty({ description: 'Width in pixels; null when unknown (e.g. some SVGs)', example: 512, nullable: true, type: Number })
  @Prop({ type: Number, default: null })
  width: number | null

  @ApiProperty({ description: 'Height in pixels; null when unknown', example: 512, nullable: true, type: Number })
  @Prop({ type: Number, default: null })
  height: number | null

  @ApiProperty({ description: 'When this file was uploaded', example: '2026-09-16T12:00:00.000Z' })
  @Prop({ required: true })
  uploadedAt: Date
}

export const BrandingAssetSchema = SchemaFactory.createForClass(BrandingAsset)

/** One optional image per slot. */
@Schema({ _id: false })
export class BrandingAssets {
  @ApiProperty({ type: BrandingAsset, nullable: true, description: 'App header, login page and documents' })
  @Prop({ type: BrandingAssetSchema, default: null })
  logo: BrandingAsset | null

  @ApiProperty({ type: BrandingAsset, nullable: true, description: 'Browser tab icon' })
  @Prop({ type: BrandingAssetSchema, default: null })
  favicon: BrandingAsset | null

  @ApiProperty({ type: BrandingAsset, nullable: true, description: 'Printed on report cards, certificates and receipts' })
  @Prop({ type: BrandingAssetSchema, default: null })
  principalSignature: BrandingAsset | null

  @ApiProperty({ type: BrandingAsset, nullable: true, description: 'Official stamp on certificates and ID cards' })
  @Prop({ type: BrandingAssetSchema, default: null })
  schoolSeal: BrandingAsset | null

  @ApiProperty({ type: BrandingAsset, nullable: true, description: 'Image behind the sign-in form' })
  @Prop({ type: BrandingAssetSchema, default: null })
  loginBackground: BrandingAsset | null
}

export const BrandingAssetsSchema = SchemaFactory.createForClass(BrandingAssets)

export type BrandingDocument = HydratedDocument<Branding>

/** The school's visual identity. There is exactly one record, found by `singletonKey`. */
@Schema({ collection: 'branding', timestamps: true, versionKey: false })
export class Branding extends BaseSchema {
  @ApiProperty({ description: 'Fixed key that keeps this a single record', example: 'school' })
  @Prop({ required: true })
  singletonKey: string

  @ApiProperty({
    description: 'School name as shown in the app, on the login page and on documents',
    example: 'Green Valley Public School',
    minLength: BRANDING_LIMITS.displayNameMin,
    maxLength: BRANDING_LIMITS.displayNameMax,
  })
  @Prop({ required: true, trim: true, maxlength: BRANDING_LIMITS.displayNameMax })
  displayName: string

  @ApiProperty({ description: 'Short form for tight spaces such as SMS and ID cards', example: 'GVPS', maxLength: BRANDING_LIMITS.shortNameMax })
  @Prop({ default: '', trim: true, maxlength: BRANDING_LIMITS.shortNameMax })
  shortName: string

  @ApiProperty({ description: 'Motto or line under the name', example: 'Learning with purpose', maxLength: BRANDING_LIMITS.taglineMax })
  @Prop({ default: '', trim: true, maxlength: BRANDING_LIMITS.taglineMax })
  tagline: string

  @ApiProperty({
    description: 'Line printed at the bottom of receipts and certificates',
    example: 'Affiliated to CBSE, New Delhi · Affiliation No. 1234567',
    maxLength: BRANDING_LIMITS.documentFooterMax,
  })
  @Prop({ default: '', trim: true, maxlength: BRANDING_LIMITS.documentFooterMax })
  documentFooter: string

  @ApiProperty({ description: 'School default brand colour; people can still pick their own', enum: COLOR_THEMES, example: 'navy' })
  @Prop({ required: true, enum: COLOR_THEMES, default: 'navy' })
  colorTheme: ColorTheme

  @ApiProperty({ type: BrandingAssets, description: 'Uploaded images; each is null until uploaded' })
  @Prop({ type: BrandingAssetsSchema, default: () => ({}) })
  assets: BrandingAssets
}

export const BrandingSchema = SchemaFactory.createForClass(Branding)

BrandingSchema.index({ singletonKey: 1 }, { unique: true, name: 'uniq_branding_singleton' })
