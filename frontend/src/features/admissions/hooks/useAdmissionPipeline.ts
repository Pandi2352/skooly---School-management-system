import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteAdmissionApplication,
  enrollApplicant,
  getAdmissionApplications,
  getAdmissionStats,
  updateAdmissionDetails,
  updateAdmissionStatus,
  type AdmissionPipelineFilters,
  type UpdateAdmissionDetailsInput,
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
    // Keeps the rows on screen while a filter or page loads, instead of flashing empty.
    placeholderData: (previous) => previous,
  })
}

export function useAdmissionStats() {
  return useQuery({
    queryKey: admissionKeys.pipelineStats(),
    queryFn: getAdmissionStats,
  })
}

/** Corrections to an applicant's details. Status and enrolment have their own mutations. */
export function useUpdateAdmissionDetails() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAdmissionDetailsInput }) =>
      updateAdmissionDetails(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: admissionKeys.all })
    },
  })
}

export function useDeleteAdmissionApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAdmissionApplication,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: admissionKeys.all })
    },
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
