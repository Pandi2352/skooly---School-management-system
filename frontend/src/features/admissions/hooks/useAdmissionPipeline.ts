import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  enrollApplicant,
  getAdmissionApplications,
  getAdmissionStats,
  updateAdmissionStatus,
  type AdmissionPipelineFilters,
} from '../api/admissionPipeline'
import { admissionKeys } from '../api/admissionKeys'
import type {
  EnrollApplicantInput,
  UpdateAdmissionStatusInput,
} from '../schemas/admissionPipeline.schema'

export function useAdmissionApplications(filters?: AdmissionPipelineFilters) {
  return useQuery({
    queryKey: admissionKeys.pipelineList(filters),
    queryFn: () => getAdmissionApplications(filters),
  })
}

export function useAdmissionStats() {
  return useQuery({
    queryKey: admissionKeys.pipelineStats(),
    queryFn: getAdmissionStats,
  })
}

export function useUpdateAdmissionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAdmissionStatusInput }) =>
      updateAdmissionStatus(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: admissionKeys.all })
    },
  })
}

export function useEnrollApplicant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EnrollApplicantInput }) =>
      enrollApplicant(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: admissionKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
