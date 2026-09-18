import { HttpStatus } from '@nestjs/common'
import { AppException } from '../../common/exceptions/app.exception'
import { BrandingErrorCode, type BrandingAssetRule } from './constants/branding.constants'

// One place for every branding error, so status codes, codes and wording stay consistent.

const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${Math.round(bytes / (1024 * 1024))} MB` : `${Math.round(bytes / 1024)} KB`

const typeNames: Record<string, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/webp': 'WebP',
  'image/svg+xml': 'SVG',
  'image/x-icon': 'ICO',
}

export const allowedTypeNames = (rule: BrandingAssetRule) =>
  rule.allowedMimeTypes.map((type) => typeNames[type] ?? type).join(', ')

const fileError = (status: HttpStatus, code: BrandingErrorCode, message: string) =>
  new AppException(status, code, message, [{ field: 'file', message }])

export const noBrandingChanges = () =>
  new AppException(HttpStatus.BAD_REQUEST, BrandingErrorCode.NO_CHANGES, 'Send at least one field to update.')

export const fileRequired = () =>
  fileError(HttpStatus.BAD_REQUEST, BrandingErrorCode.FILE_REQUIRED, 'Attach an image in the "file" field.')

export const unsupportedFile = (rule: BrandingAssetRule) =>
  fileError(
    HttpStatus.UNPROCESSABLE_ENTITY,
    BrandingErrorCode.UNSUPPORTED_FILE,
    `${rule.label} must be a ${allowedTypeNames(rule)} image.`,
  )

export const fileTooLarge = (rule: BrandingAssetRule) =>
  fileError(
    HttpStatus.PAYLOAD_TOO_LARGE,
    BrandingErrorCode.FILE_TOO_LARGE,
    `${rule.label} must be ${formatBytes(rule.maxBytes)} or smaller.`,
  )

export const unsafeSvg = (reason: string) =>
  fileError(
    HttpStatus.UNPROCESSABLE_ENTITY,
    BrandingErrorCode.UNSAFE_SVG,
    `This SVG contains ${reason}, which isn't allowed. Export it again as a plain SVG, or upload a PNG.`,
  )

export const imageUnreadable = (rule: BrandingAssetRule) =>
  fileError(
    HttpStatus.UNPROCESSABLE_ENTITY,
    BrandingErrorCode.IMAGE_UNREADABLE,
    `The ${rule.label.toLowerCase()} image couldn't be read. Try saving it again, or use another file.`,
  )

export const imageTooSmall = (rule: BrandingAssetRule, width: number, height: number) =>
  fileError(
    HttpStatus.UNPROCESSABLE_ENTITY,
    BrandingErrorCode.IMAGE_TOO_SMALL,
    `${rule.label} is ${width}×${height} pixels; use at least ${rule.minWidth}×${rule.minHeight} (best ${rule.recommendedWidth}×${rule.recommendedHeight}).`,
  )

export const imageTooLarge = (rule: BrandingAssetRule, maxDimension: number) =>
  fileError(
    HttpStatus.UNPROCESSABLE_ENTITY,
    BrandingErrorCode.IMAGE_TOO_LARGE,
    `${rule.label} is wider or taller than ${maxDimension} pixels. Resize it and try again.`,
  )

export const imageNotSquare = (rule: BrandingAssetRule, width: number, height: number) =>
  fileError(
    HttpStatus.UNPROCESSABLE_ENTITY,
    BrandingErrorCode.IMAGE_NOT_SQUARE,
    `${rule.label} must be square; this one is ${width}×${height} pixels.`,
  )

export const assetNotSet = (rule: BrandingAssetRule) =>
  new AppException(
    HttpStatus.NOT_FOUND,
    BrandingErrorCode.ASSET_NOT_SET,
    `There's no ${rule.label.toLowerCase()} to remove.`,
  )
