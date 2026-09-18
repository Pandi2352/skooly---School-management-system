import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { FILE_STORAGE, type FileStorage } from '../../common/storage/file-storage.interface'
import { cleanOriginalName, findUnsafeSvgContent, inspectImage, type InspectedImage } from '../../common/utils/image-inspect.util'
import {
  assetFolder,
  BRANDING_ASSET_RULES,
  MAX_IMAGE_DIMENSION,
  type BrandingAssetRule,
  type BrandingAssetType,
} from './constants/branding.constants'
import { BrandingAssetRuleResponseDto, BrandingResponseDto } from './dto/branding-response.dto'
import { UpdateBrandingDto } from './dto/update-branding.dto'
import {
  assetNotSet,
  fileRequired,
  fileTooLarge,
  imageNotSquare,
  imageTooLarge,
  imageTooSmall,
  imageUnreadable,
  noBrandingChanges,
  unsafeSvg,
  unsupportedFile,
} from './branding.errors'
import { toAssetRuleResponses, toBrandingResponse } from './branding.mapper'
import { BrandingAssetRecord, BrandingChanges, BrandingRecord, BrandingRepository } from './branding.repository'

/** An uploaded file as multer hands it over (memory storage). */
export type UploadedImageFile = Pick<Express.Multer.File, 'buffer' | 'size' | 'originalname'>

/**
 * Checks an upload against its slot's rules, looking only at the file's real contents. Returns the
 * inspected image, or throws the error to send back.
 */
export function validateBrandingImage(rule: BrandingAssetRule, file: UploadedImageFile): InspectedImage {
  if (file.size > rule.maxBytes) throw fileTooLarge(rule)

  const image = inspectImage(file.buffer)
  if (!image || !rule.allowedMimeTypes.includes(image.mimeType)) throw unsupportedFile(rule)

  if (image.kind === 'svg') {
    const reason = findUnsafeSvgContent(file.buffer)
    if (reason) throw unsafeSvg(reason)
    // Vector images scale to any size, so pixel limits don't apply.
    return image
  }

  if (image.width === null || image.height === null || image.width === 0 || image.height === 0) {
    throw imageUnreadable(rule)
  }
  if (image.width > MAX_IMAGE_DIMENSION || image.height > MAX_IMAGE_DIMENSION) {
    throw imageTooLarge(rule, MAX_IMAGE_DIMENSION)
  }
  if (image.width < rule.minWidth || image.height < rule.minHeight) {
    throw imageTooSmall(rule, image.width, image.height)
  }
  if (rule.square && image.width !== image.height) throw imageNotSquare(rule, image.width, image.height)
  return image
}

/** School branding: name, tagline, document footer, default colour and the five branding images. */
@Injectable()
export class BrandingService implements OnModuleInit {
  private readonly logger = new Logger(BrandingService.name)

  constructor(
    private readonly brandingRepository: BrandingRepository,
    @Inject(FILE_STORAGE) private readonly storage: FileStorage,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.brandingRepository.ensureExists()
    } catch (error) {
      this.logger.error('Could not prepare the branding record', error instanceof Error ? error.stack : String(error))
    }
  }

  async getBranding(): Promise<BrandingResponseDto> {
    return toBrandingResponse(await this.getRecord(), this.storage)
  }

  getAssetRules(): BrandingAssetRuleResponseDto[] {
    return toAssetRuleResponses()
  }

  async update(dto: UpdateBrandingDto): Promise<BrandingResponseDto> {
    const changes: BrandingChanges = {}
    if (dto.displayName !== undefined) changes.displayName = dto.displayName
    if (dto.shortName !== undefined) changes.shortName = dto.shortName
    if (dto.tagline !== undefined) changes.tagline = dto.tagline
    if (dto.documentFooter !== undefined) changes.documentFooter = dto.documentFooter
    if (dto.colorTheme !== undefined) changes.colorTheme = dto.colorTheme
    if (Object.keys(changes).length === 0) throw noBrandingChanges()

    await this.getRecord()
    const updated = await this.brandingRepository.update(changes)
    return toBrandingResponse(updated ?? (await this.getRecord()), this.storage)
  }

  /**
   * Saves a new image for a slot. The file is stored first, then the record points at it, then
   * the replaced file is deleted. If the database update fails, the new file is removed again, so
   * no orphan files or broken links are left behind.
   */
  async uploadAsset(type: BrandingAssetType, file: UploadedImageFile | undefined): Promise<BrandingResponseDto> {
    if (!file) throw fileRequired()
    const rule = BRANDING_ASSET_RULES[type]
    const image = validateBrandingImage(rule, file)
    await this.getRecord()

    const stored = await this.storage.save({
      buffer: file.buffer,
      folder: assetFolder(type),
      extension: image.extension,
      contentType: image.mimeType,
    })
    const asset: BrandingAssetRecord = {
      key: stored.key,
      originalName: cleanOriginalName(file.originalname),
      mimeType: image.mimeType,
      sizeBytes: file.size,
      width: image.width,
      height: image.height,
      uploadedAt: new Date(),
    }

    try {
      const { previous, updated } = await this.brandingRepository.setAsset(type, asset)
      if (previous) await this.removeFileQuietly(previous.key)
      return toBrandingResponse(updated ?? (await this.getRecord()), this.storage)
    } catch (error) {
      await this.removeFileQuietly(stored.key)
      throw error
    }
  }

  async removeAsset(type: BrandingAssetType): Promise<BrandingResponseDto> {
    const { previous, updated } = await this.brandingRepository.setAsset(type, null)
    if (!previous) throw assetNotSet(BRANDING_ASSET_RULES[type])
    await this.removeFileQuietly(previous.key)
    return toBrandingResponse(updated ?? (await this.getRecord()), this.storage)
  }

  /** The branding record, created with defaults if it's missing (e.g. the startup step failed). */
  private async getRecord(): Promise<BrandingRecord> {
    const existing = await this.brandingRepository.find()
    if (existing) return existing
    await this.brandingRepository.ensureExists()
    const created = await this.brandingRepository.find()
    if (!created) throw new Error('The branding record could not be created.')
    return created
  }

  /** A leftover file is harmless; a failed request because of one isn't. Log and carry on. */
  private async removeFileQuietly(key: string): Promise<void> {
    try {
      await this.storage.remove(key)
    } catch (error) {
      this.logger.warn(`Could not delete old branding file "${key}": ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
