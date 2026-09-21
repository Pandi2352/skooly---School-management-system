import { HttpStatus } from '@nestjs/common'
import { AppException } from '../../common/exceptions/app.exception'
import { ADMISSION_SETTINGS_LIMITS, AdmissionSettingsErrorCode, PAYMENT_QR_RULE } from './constants/admission-settings.constants'

// One place for every admission settings error, so codes and wording stay consistent.

export const feeAmountRequired = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AdmissionSettingsErrorCode.FEE_REQUIRED,
    'Set what applying costs before charging a fee.',
    [{ field: 'feeAmount', message: `Enter an amount between 1 and ${ADMISSION_SETTINGS_LIMITS.feeMax}.` }],
  )

export const paymentQrRequired = () =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    AdmissionSettingsErrorCode.QR_REQUIRED,
    'Upload the UPI QR code families will pay with before charging a fee.',
  )

export const fileRequired = () =>
  new AppException(HttpStatus.BAD_REQUEST, AdmissionSettingsErrorCode.FILE_REQUIRED, 'Choose an image to upload.')

export const unsupportedQrFile = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AdmissionSettingsErrorCode.UNSUPPORTED_FILE,
    `Upload a PNG, JPEG or WebP image of at least ${PAYMENT_QR_RULE.minDimension}px, up to ${Math.round(PAYMENT_QR_RULE.maxBytes / (1024 * 1024))}MB. A screenshot from your payment app is fine.`,
  )

export const noSettingsChanges = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AdmissionSettingsErrorCode.NO_CHANGES,
    'Nothing was changed. Edit a setting and save again.',
  )
