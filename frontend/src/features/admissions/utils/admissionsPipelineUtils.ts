import type { BadgeTone } from '@/components/ui/Badge'
import type {
  AdmissionApplicationStatus,
  AdmissionDocumentStatus,
} from '../schemas/admissionPipeline.schema'

export function formatAdmissionStatus(status: AdmissionApplicationStatus): string {
  switch (status) {
    case 'under-review':
      return 'Under Review'
    case 'approved':
      return 'Approved'
    case 'enrolled':
      return 'Enrolled'
    case 'rejected':
      return 'Rejected'
    case 'submitted':
      return 'Submitted'
    case 'draft':
      return 'Draft'
    default:
      return status
  }
}

export function getAdmissionStatusTone(status: AdmissionApplicationStatus): BadgeTone {
  switch (status) {
    case 'under-review':
      return 'planned'
    case 'approved':
      return 'success'
    case 'enrolled':
      return 'primary'
    case 'rejected':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function getVerifiedDocumentsCount(
  docs: { name: string; status: AdmissionDocumentStatus; url?: string; fileUrl?: string }[],
): {
  verified: number
  total: number
  isComplete: boolean
} {
  const total = docs.length
  const verified = docs.filter((d) => d.status === 'verified').length
  return {
    verified,
    total,
    isComplete: total > 0 && verified === total,
  }
}

export function calculateApplicantAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  if (isNaN(dob.getTime())) return 0
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const m = now.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--
  }
  return Math.max(0, age)
}
