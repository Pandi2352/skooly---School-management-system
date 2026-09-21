import { api } from '@/lib/api/client'
import { admissionSettingsSchema } from '../schemas/admissionSettings.schema'
import type { AdmissionSettings } from '../types/admissionSettings.types'
import { SAMPLE_ADMISSION_SETTINGS } from './sample/sampleAdmissionSettings'

export function getAdmissionSettings(): Promise<AdmissionSettings> {
  if (import.meta.env.MODE === 'test') return Promise.resolve(SAMPLE_ADMISSION_SETTINGS)
  return api.get('/admission-settings', admissionSettingsSchema)
}

export type AdmissionSettingsInput = {
  admissionsOpen?: boolean
  sessionLabel?: string
  publicSlug?: string
  feeEnabled?: boolean
  feeAmount?: number
  feeNote?: string
}

export function updateAdmissionSettings(input: AdmissionSettingsInput): Promise<AdmissionSettings> {
  return api.patch('/admission-settings', admissionSettingsSchema, input)
}

/** The UPI code families scan. Sent as a file so the server can check its real contents. */
export function uploadPaymentQr(file: File): Promise<AdmissionSettings> {
  const form = new FormData()
  form.append('file', file)
  return api.upload('/admission-settings/payment-qr', admissionSettingsSchema, form, { method: 'PUT' })
}

export function removePaymentQr(): Promise<AdmissionSettings> {
  return api.delete('/admission-settings/payment-qr', admissionSettingsSchema)
}
