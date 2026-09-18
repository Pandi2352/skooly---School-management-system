import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ApiErrors, ApiSuccess } from '../../common/decorators/api-envelope.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import { PermissionsGuard } from '../../common/guards/permissions.guard'
import { BRANDING_ASSET_TYPES, BRANDING_PERMISSIONS, MAX_BRANDING_UPLOAD_BYTES } from './constants/branding.constants'
import { AssetTypeParamDto } from './dto/asset-type-param.dto'
import { BrandingAssetRuleResponseDto, BrandingResponseDto } from './dto/branding-response.dto'
import { UpdateBrandingDto } from './dto/update-branding.dto'
import { BrandingService } from './branding.service'

const ASSET_TYPE_PARAM = {
  name: 'assetType',
  enum: BRANDING_ASSET_TYPES,
  description: 'Which branding image',
}

/** HTTP only: validation, status codes and messages. Every rule is in BrandingService. */
@ApiTags('Branding')
@UseGuards(PermissionsGuard)
@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get()
  @Public()
  @ResponseMessage('Branding fetched successfully.')
  @ApiOperation({
    summary: 'Get school branding',
    description: 'Public: the login page and browser tab need the name, logo and favicon before anyone signs in.',
  })
  @ApiSuccess(BrandingResponseDto, { description: 'Branding with image URLs (null for images not uploaded)' })
  @ApiErrors(HttpStatus.INTERNAL_SERVER_ERROR)
  getBranding(): Promise<BrandingResponseDto> {
    return this.brandingService.getBranding()
  }

  @Get('asset-rules')
  @Public()
  @ResponseMessage('Branding image rules fetched successfully.')
  @ApiOperation({ summary: 'Upload rules for each branding image', description: 'Allowed types, size limit and pixel sizes per slot.' })
  @ApiSuccess(BrandingAssetRuleResponseDto, { description: 'One rule per image slot', isArray: true })
  getAssetRules(): BrandingAssetRuleResponseDto[] {
    return this.brandingService.getAssetRules()
  }

  @Patch()
  @RequirePermissions(BRANDING_PERMISSIONS.edit)
  @ResponseMessage('Branding updated successfully.')
  @ApiOperation({ summary: 'Update branding text and colour', description: 'Send any of the fields; at least one.' })
  @ApiSuccess(BrandingResponseDto, { description: 'The updated branding' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN)
  update(@Body() dto: UpdateBrandingDto): Promise<BrandingResponseDto> {
    return this.brandingService.update(dto)
  }

  @Put('assets/:assetType')
  @RequirePermissions(BRANDING_PERMISSIONS.edit)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_BRANDING_UPLOAD_BYTES, files: 1, fields: 0 } }))
  @ResponseMessage('Branding image uploaded successfully.')
  @ApiOperation({
    summary: 'Upload or replace a branding image',
    description: 'multipart/form-data with one "file". The type is checked from the file contents; the old file is deleted.',
  })
  @ApiParam(ASSET_TYPE_PARAM)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' } } },
  })
  @ApiSuccess(BrandingResponseDto, { description: 'Branding with the new image URL' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.PAYLOAD_TOO_LARGE,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  uploadAsset(
    @Param() params: AssetTypeParamDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<BrandingResponseDto> {
    return this.brandingService.uploadAsset(params.assetType, file)
  }

  @Delete('assets/:assetType')
  @RequirePermissions(BRANDING_PERMISSIONS.edit)
  @ResponseMessage('Branding image removed successfully.')
  @ApiOperation({ summary: 'Remove a branding image', description: 'Deletes the file and clears the slot.' })
  @ApiParam(ASSET_TYPE_PARAM)
  @ApiSuccess(BrandingResponseDto, { description: 'Branding without that image' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND)
  removeAsset(@Param() params: AssetTypeParamDto): Promise<BrandingResponseDto> {
    return this.brandingService.removeAsset(params.assetType)
  }
}
