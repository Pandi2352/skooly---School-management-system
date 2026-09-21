/**
 * Permission keys for this page, matching what the Roles & Permissions page shows for
 * Admissions → Admission Settings.
 */
export const ADMISSION_SETTINGS_PERMISSIONS = {
  view: 'admissions.admission-settings:view',
  edit: 'admissions.admission-settings:edit',
} as const

export const ADMISSION_SETTINGS_LIMITS = {
  slugMin: 3,
  slugMax: 60,
  sessionLabelMax: 20,
  noteMax: 300,
  /** A fee, not a tuition bill: anything larger is a mistake worth catching. */
  feeMax: 100_000,
} as const

/**
 * The public address a school hands out: letters, numbers and dashes only. It ends up in print, on
 * a QR code and in conversation, so underscores, capitals and spaces are ruled out.
 */
export const ADMISSION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** What the payment QR may be. A UPI code is a photo or a screenshot, so no SVG. */
export const PAYMENT_QR_RULE = {
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'] as readonly string[],
  maxBytes: 2 * 1024 * 1024,
  minDimension: 200,
} as const

/** Codes for admission settings failures. */
export enum AdmissionSettingsErrorCode {
  SLUG_INVALID = 'ADMISSION_SLUG_INVALID',
  FEE_REQUIRED = 'ADMISSION_FEE_REQUIRED',
  QR_REQUIRED = 'ADMISSION_PAYMENT_QR_REQUIRED',
  FILE_REQUIRED = 'ADMISSION_FILE_REQUIRED',
  UNSUPPORTED_FILE = 'ADMISSION_UNSUPPORTED_FILE',
  NO_CHANGES = 'ADMISSION_SETTINGS_NO_CHANGES',
}
