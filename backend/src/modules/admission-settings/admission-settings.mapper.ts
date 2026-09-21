import type { AdmissionSettingsResponseDto } from './dto/admission-settings.dto'
import type { AdmissionSettingsRecord } from './admission-settings.repository'

/**
 * The public shape. `publicPageLive` is false until the public application page exists: the
 * address can be reserved now, but a school shouldn't print a QR code that leads nowhere.
 */
export function toAdmissionSettingsResponse(
  record: AdmissionSettingsRecord,
  appUrl: string,
): AdmissionSettingsResponseDto {
  return {
    admissionsOpen: record.admissionsOpen,
    sessionLabel: record.sessionLabel,
    publicSlug: record.publicSlug,
    publicUrl: record.publicSlug ? `${appUrl}/admission/${record.publicSlug}` : '',
    publicPageLive: false,
    feeEnabled: record.feeEnabled,
    feeAmount: record.feeAmount,
    feeNote: record.feeNote,
    paymentQr: record.paymentQr
      ? {
          url: record.paymentQr.url,
          originalName: record.paymentQr.originalName,
          sizeInBytes: record.paymentQr.sizeInBytes,
          uploadedAt: new Date(record.paymentQr.uploadedAt).toISOString(),
        }
      : null,
    updatedAt: new Date(record.updatedAt).toISOString(),
  }
}
