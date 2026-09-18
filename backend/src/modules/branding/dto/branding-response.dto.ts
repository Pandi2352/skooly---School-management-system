import { ApiProperty } from '@nestjs/swagger'
import { BRANDING_ASSET_TYPES, COLOR_THEMES, type BrandingAssetType, type ColorTheme } from '../constants/branding.constants'

export class BrandingAssetResponseDto {
  @ApiProperty({ enum: BRANDING_ASSET_TYPES, example: 'logo' })
  type: BrandingAssetType

  @ApiProperty({ example: 'http://localhost:4000/uploads/branding/logo/3f2b8c1e-9a4d-4c7e-8b21-5d6f0a9e1c34.png' })
  url: string

  @ApiProperty({ example: 'school-logo.png' })
  originalName: string

  @ApiProperty({ example: 'image/png' })
  mimeType: string

  @ApiProperty({ example: 48213 })
  sizeBytes: number

  @ApiProperty({ example: 512, nullable: true, type: Number })
  width: number | null

  @ApiProperty({ example: 512, nullable: true, type: Number })
  height: number | null

  @ApiProperty({ example: '2026-09-16T12:00:00.000Z' })
  uploadedAt: string
}

export class BrandingAssetsResponseDto {
  @ApiProperty({ type: BrandingAssetResponseDto, nullable: true })
  logo: BrandingAssetResponseDto | null

  @ApiProperty({ type: BrandingAssetResponseDto, nullable: true })
  favicon: BrandingAssetResponseDto | null

  @ApiProperty({ type: BrandingAssetResponseDto, nullable: true })
  principalSignature: BrandingAssetResponseDto | null

  @ApiProperty({ type: BrandingAssetResponseDto, nullable: true })
  schoolSeal: BrandingAssetResponseDto | null

  @ApiProperty({ type: BrandingAssetResponseDto, nullable: true })
  loginBackground: BrandingAssetResponseDto | null
}

export class BrandingResponseDto {
  @ApiProperty({ format: 'uuid', example: '6f1d2c3b-4a5e-4f60-9b7a-8c9d0e1f2a3b' })
  id: string

  @ApiProperty({ example: 'Green Valley Public School' })
  displayName: string

  @ApiProperty({ example: 'GVPS' })
  shortName: string

  @ApiProperty({ example: 'Learning with purpose' })
  tagline: string

  @ApiProperty({ example: 'Affiliated to CBSE, New Delhi · Affiliation No. 1234567' })
  documentFooter: string

  @ApiProperty({ enum: COLOR_THEMES, example: 'navy' })
  colorTheme: ColorTheme

  @ApiProperty({ type: BrandingAssetsResponseDto })
  assets: BrandingAssetsResponseDto

  @ApiProperty({ example: '2026-09-16T12:00:00.000Z' })
  updatedAt: string
}

export class BrandingAssetRuleResponseDto {
  @ApiProperty({ enum: BRANDING_ASSET_TYPES, example: 'favicon' })
  type: BrandingAssetType

  @ApiProperty({ example: 'Favicon' })
  label: string

  @ApiProperty({ example: 'The small icon in browser tabs and bookmarks.' })
  description: string

  @ApiProperty({ type: [String], example: ['image/png', 'image/x-icon'] })
  allowedMimeTypes: string[]

  @ApiProperty({ example: 524288 })
  maxBytes: number

  @ApiProperty({ example: 32 })
  minWidth: number

  @ApiProperty({ example: 32 })
  minHeight: number

  @ApiProperty({ example: 180 })
  recommendedWidth: number

  @ApiProperty({ example: 180 })
  recommendedHeight: number

  @ApiProperty({ example: true })
  square: boolean
}
