/**
 * Permission keys for Admissions → Admission Settings. The API checks the same keys; these exist so
 * a control nobody may use isn't offered in the first place.
 */
export const ADMISSION_SETTINGS_PERMISSIONS = {
  view: 'admissions.admission-settings:view',
  edit: 'admissions.admission-settings:edit',
} as const

/** Text and amount limits, matching the backend's UpdateAdmissionSettingsDto. */
export const ADMISSION_SETTINGS_LIMITS = {
  sessionLabelMax: 20,
  slugMin: 3,
  slugMax: 60,
  noteMax: 300,
  feeMax: 100_000,
} as const

/** What the payment QR upload accepts, matching PAYMENT_QR_RULE on the server. */
export const PAYMENT_QR_RULE = {
  accept: 'image/png,image/jpeg,image/webp',
  maxBytes: 2 * 1024 * 1024,
  minDimension: 200,
} as const
