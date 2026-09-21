import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAdmissionSettings,
  removePaymentQr,
  updateAdmissionSettings,
  uploadPaymentQr,
} from '../api/admissionSettings'

const admissionSettingsKey = ['admission-settings'] as const

export function useAdmissionSettings() {
  return useQuery({ queryKey: admissionSettingsKey, queryFn: getAdmissionSettings })
}

/** Every change answers with the whole record, so the cache is replaced rather than refetched. */
function useApplySettings() {
  const queryClient = useQueryClient()
  return (settings: Awaited<ReturnType<typeof getAdmissionSettings>>) => {
    queryClient.setQueryData(admissionSettingsKey, settings)
  }
}

export function useUpdateAdmissionSettings() {
  const apply = useApplySettings()
  return useMutation({ mutationFn: updateAdmissionSettings, onSuccess: apply })
}

export function useUploadPaymentQr() {
  const apply = useApplySettings()
  return useMutation({ mutationFn: uploadPaymentQr, onSuccess: apply })
}

export function useRemovePaymentQr() {
  const apply = useApplySettings()
  return useMutation({ mutationFn: removePaymentQr, onSuccess: apply })
}
