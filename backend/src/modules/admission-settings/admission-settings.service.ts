import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { FILE_STORAGE, type FileStorage } from '../../common/storage/file-storage.interface'
import { cleanOriginalName, inspectImage } from '../../common/utils/image-inspect.util'
import { isDuplicateKeyError } from '../../common/utils/mongo-error.util'
import type { AppEnvConfig } from '../../config/env.config'
import { AuditService } from '../audit/audit.service'
import { PAYMENT_QR_RULE } from './constants/admission-settings.constants'
import {
  feeAmountRequired,
  fileRequired,
  noSettingsChanges,
  paymentQrRequired,
  unsupportedQrFile,
} from './admission-settings.errors'
import { toAdmissionSettingsResponse } from './admission-settings.mapper'
import {
  AdmissionSettingsChanges,
  AdmissionSettingsRecord,
  AdmissionSettingsRepository,
} from './admission-settings.repository'
import type { AdmissionSettingsResponseDto, UpdateAdmissionSettingsDto } from './dto/admission-settings.dto'

export type UploadedImageFile = {
  buffer: Buffer
  originalname: string
  size: number
}

/**
 * How a school takes admissions: whether applying costs anything, how families pay, and the
 * address the public application form will use.
 *
 * The public page itself isn't built yet, so the settings are saved and the address is reserved,
 * but the response says `publicPageLive: false` — a printed QR code pointing at nothing would be
 * worse than no QR code.
 */
@Injectable()
export class AdmissionSettingsService implements OnModuleInit {
  private readonly logger = new Logger(AdmissionSettingsService.name)

  constructor(
    private readonly settingsRepository: AdmissionSettingsRepository,
    private readonly auditService: AuditService,
    private readonly configService: ConfigService,
    @Inject(FILE_STORAGE) private readonly storage: FileStorage,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.settingsRepository.syncIndexes()
    } catch (error) {
      this.logger.error(
        `Could not sync admission settings indexes: ${error instanceof Error ? error.message : 'unknown error'}`,
      )
    }
  }

  async get(): Promise<AdmissionSettingsResponseDto> {
    return this.present(await this.settingsRepository.findOrCreate())
  }

  async update(
    dto: UpdateAdmissionSettingsDto,
    actor?: AuthenticatedUserContext,
  ): Promise<AdmissionSettingsResponseDto> {
    const current = await this.settingsRepository.findOrCreate()
    const changes: AdmissionSettingsChanges = {}

    if (dto.admissionsOpen !== undefined && dto.admissionsOpen !== current.admissionsOpen) {
      changes.admissionsOpen = dto.admissionsOpen
    }
    if (dto.sessionLabel !== undefined && dto.sessionLabel !== current.sessionLabel) {
      changes.sessionLabel = dto.sessionLabel
    }
    if (dto.publicSlug !== undefined && dto.publicSlug !== current.publicSlug) changes.publicSlug = dto.publicSlug
    if (dto.feeNote !== undefined && dto.feeNote !== current.feeNote) changes.feeNote = dto.feeNote
    if (dto.feeAmount !== undefined && dto.feeAmount !== current.feeAmount) changes.feeAmount = dto.feeAmount
    if (dto.feeEnabled !== undefined && dto.feeEnabled !== current.feeEnabled) changes.feeEnabled = dto.feeEnabled

    if (Object.keys(changes).length === 0) throw noSettingsChanges()

    // Charging a fee needs both a price and a way to pay it, or families are asked for money with
    // nowhere to send it.
    const feeEnabled = changes.feeEnabled ?? current.feeEnabled
    if (feeEnabled) {
      const amount = changes.feeAmount ?? current.feeAmount
      if (amount <= 0) throw feeAmountRequired()
      if (!current.paymentQr) throw paymentQrRequired()
    }

    changes.updatedBy = actor?.id ?? null

    try {
      const updated = await this.settingsRepository.update(changes)
      if (!updated) throw noSettingsChanges()

      await this.auditService.record('admission_settings.updated', {
        actor,
        summary: describeChanges(current, updated),
      })
      return this.present(updated)
    } catch (error) {
      // The slug is unique; one school today, but the index is what keeps that true.
      if (isDuplicateKeyError(error)) throw noSettingsChanges()
      throw error
    }
  }

  /** The UPI QR families scan. Checked by its contents, never by its name or claimed type. */
  async uploadPaymentQr(
    file: UploadedImageFile | undefined,
    actor?: AuthenticatedUserContext,
  ): Promise<AdmissionSettingsResponseDto> {
    if (!file) throw fileRequired()
    if (file.size > PAYMENT_QR_RULE.maxBytes) throw unsupportedQrFile()

    const image = inspectImage(file.buffer)
    if (!image || !PAYMENT_QR_RULE.allowedMimeTypes.includes(image.mimeType)) throw unsupportedQrFile()
    // A QR too small to scan is worse than none: it fails at the counter, not here.
    if ((image.width ?? 0) < PAYMENT_QR_RULE.minDimension || (image.height ?? 0) < PAYMENT_QR_RULE.minDimension) {
      throw unsupportedQrFile()
    }

    const current = await this.settingsRepository.findOrCreate()
    const stored = await this.storage.save({
      buffer: file.buffer,
      folder: 'admissions/payment-qr',
      // From the detected file type, never from the uploaded name.
      extension: image.extension,
      contentType: image.mimeType,
    })

    const updated = await this.settingsRepository.update({
      paymentQr: {
        key: stored.key,
        url: this.storage.publicUrl(stored.key),
        originalName: cleanOriginalName(file.originalname),
        sizeInBytes: file.size,
        uploadedAt: new Date(),
      },
      updatedBy: actor?.id ?? null,
    })
    if (!updated) throw fileRequired()

    // Only once the new file is safely recorded, so a failed save never leaves the school with none.
    if (current.paymentQr) await this.removeFileQuietly(current.paymentQr.key)

    await this.auditService.record('admission_settings.updated', { actor, summary: 'Payment QR code uploaded' })
    return this.present(updated)
  }

  async removePaymentQr(actor?: AuthenticatedUserContext): Promise<AdmissionSettingsResponseDto> {
    const current = await this.settingsRepository.findOrCreate()
    if (!current.paymentQr) return this.present(current)

    // Removing the way to pay also stops the charge; the alternative is a fee nobody can settle.
    const updated = await this.settingsRepository.update({
      paymentQr: null,
      feeEnabled: false,
      updatedBy: actor?.id ?? null,
    })
    if (!updated) throw fileRequired()

    await this.removeFileQuietly(current.paymentQr.key)
    await this.auditService.record('admission_settings.updated', {
      actor,
      summary: 'Payment QR code removed, so the admission fee is off',
    })
    return this.present(updated)
  }

  private present(record: AdmissionSettingsRecord): AdmissionSettingsResponseDto {
    const appUrl = this.configService.get<AppEnvConfig>('app')?.appUrl ?? ''
    return toAdmissionSettingsResponse(record, appUrl)
  }

  /** A file that can't be deleted shouldn't fail the request that replaced it. */
  private async removeFileQuietly(key: string): Promise<void> {
    try {
      await this.storage.remove(key)
    } catch (error) {
      this.logger.warn(`Could not remove ${key}: ${error instanceof Error ? error.message : 'unknown error'}`)
    }
  }
}

/** A short "what changed" line for the audit trail, rather than a dump of the record. */
function describeChanges(before: AdmissionSettingsRecord, after: AdmissionSettingsRecord): string {
  const parts: string[] = []
  if (before.admissionsOpen !== after.admissionsOpen) parts.push(after.admissionsOpen ? 'admissions opened' : 'admissions closed')
  if (before.publicSlug !== after.publicSlug) parts.push(`public address set to "${after.publicSlug}"`)
  if (before.feeEnabled !== after.feeEnabled) parts.push(after.feeEnabled ? 'fee switched on' : 'fee switched off')
  if (before.feeAmount !== after.feeAmount) parts.push(`fee set to ${after.feeAmount}`)
  if (before.sessionLabel !== after.sessionLabel) parts.push(`session set to "${after.sessionLabel}"`)
  if (before.feeNote !== after.feeNote) parts.push('fee note changed')
  return parts.length > 0 ? parts.join(', ') : 'settings updated'
}
