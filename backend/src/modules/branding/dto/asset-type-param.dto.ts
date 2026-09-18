import { ApiProperty } from '@nestjs/swagger'
import { IsIn } from 'class-validator'
import { BRANDING_ASSET_TYPES, type BrandingAssetType } from '../constants/branding.constants'

export class AssetTypeParamDto {
  @ApiProperty({ enum: BRANDING_ASSET_TYPES, example: 'logo', description: 'Which branding image' })
  @IsIn(BRANDING_ASSET_TYPES, { message: `assetType must be one of: ${BRANDING_ASSET_TYPES.join(', ')}.` })
  assetType: BrandingAssetType
}
