import type { AdmissionSettings } from '../../types/admissionSettings.types'

/** Settings used by unit tests only; the app reads the real API in every other mode. */
export const SAMPLE_ADMISSION_SETTINGS: AdmissionSettings = {
  admissionsOpen: true,
  sessionLabel: '2026-27',
  publicSlug: 'sample-school',
  publicUrl: 'http://localhost:5173/admission/sample-school',
  publicPageLive: false,
  feeEnabled: false,
  feeAmount: 0,
  feeNote: '',
  paymentQr: null,
  updatedAt: '2026-09-21T09:00:00.000Z',
}
