import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getStaff,
  getStaffMember,
  getStaffStats,
  createStaffMember,
  updateStaffMember,
  uploadStaffPhoto,
} from '../api/getStaff'
import {
  createLeave,
  createEvaluation,
  getApplicants,
  getEvaluations,
  getJobs,
  getLeaves,
  updateApplicantStatus,
  updateLeaveStatus,
  createJob,
  createApplicant,
} from '../api/staffSubResources'
import { staffKeys } from '../api/staffKeys'
import type { StaffFilters, LeaveFilters } from '../types/staff.types'
import type { LeaveApplication, Evaluation, JobPosting, JobApplicant } from '../types/staff.types'

// ── Staff list & detail ──────────────────────────────────────────────────────

export function useStaff(filters: StaffFilters) {
  return useQuery({
    queryKey: staffKeys.list(filters),
    queryFn: () => getStaff(filters),
    placeholderData: keepPreviousData,
  })
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => getStaffMember(id),
    enabled: Boolean(id),
  })
}

export function useStaffStats() {
  return useQuery({
    queryKey: staffKeys.stats(),
    queryFn: getStaffStats,
    staleTime: 60_000,
  })
}

export function useCreateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createStaffMember,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffKeys.all })
    },
  })
}

export function useUpdateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof updateStaffMember>[1] }) =>
      updateStaffMember(id, patch),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: staffKeys.all })
      void qc.invalidateQueries({ queryKey: staffKeys.detail(variables.id) })
    },
  })
}

export function useUploadStaffPhoto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, photoUrl }: { id: string; photoUrl: string }) =>
      uploadStaffPhoto(id, photoUrl),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: staffKeys.all })
      void qc.invalidateQueries({ queryKey: staffKeys.detail(variables.id) })
    },
  })
}

// ── Leaves ───────────────────────────────────────────────────────────────────

export function useLeaves(filters: LeaveFilters) {
  return useQuery({
    queryKey: staffKeys.leaveList(filters),
    queryFn: () => getLeaves(filters),
    placeholderData: keepPreviousData,
  })
}

export function useSubmitLeave() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Omit<LeaveApplication, 'id' | 'status' | 'createdAt'>) => createLeave(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: staffKeys.leaves() }),
  })
}

export function useUpdateLeaveStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, remarks }: { id: string; status: LeaveApplication['status']; remarks?: string }) =>
      updateLeaveStatus(id, status, remarks),
    onSuccess: () => void qc.invalidateQueries({ queryKey: staffKeys.leaves() }),
  })
}

// ── Evaluations ──────────────────────────────────────────────────────────────

export function useEvaluations(staffId?: string) {
  return useQuery({
    queryKey: staffKeys.evaluationList(staffId),
    queryFn: () => getEvaluations(staffId),
  })
}

export function useCreateEvaluation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Omit<Evaluation, 'id' | 'createdAt'>) => createEvaluation(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: staffKeys.evaluations() }),
  })
}

// ── Recruitment ──────────────────────────────────────────────────────────────

export function useJobs() {
  return useQuery({
    queryKey: staffKeys.jobs(),
    queryFn: getJobs,
  })
}

export function useApplicants(jobId: string) {
  return useQuery({
    queryKey: staffKeys.applicants(jobId),
    queryFn: () => getApplicants(jobId),
    enabled: Boolean(jobId),
  })
}

export function useCreateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Omit<JobPosting, 'id' | 'createdAt' | 'status'>) => createJob(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: staffKeys.jobs() }),
  })
}

export function useCreateApplicant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Omit<JobApplicant, 'id' | 'createdAt' | 'status'>) => createApplicant(body),
    onSuccess: (_data, variables) => void qc.invalidateQueries({ queryKey: staffKeys.applicants(variables.jobId) }),
  })
}

export function useUpdateApplicantStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
      interviewDate,
    }: {
      id: string
      jobId: string
      status: JobApplicant['status']
      interviewDate?: string
    }) => updateApplicantStatus(id, status, interviewDate),
    onSuccess: (_data, variables) =>
      void qc.invalidateQueries({ queryKey: staffKeys.applicants(variables.jobId) }),
  })
}
