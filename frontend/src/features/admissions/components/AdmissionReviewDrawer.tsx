import { useState } from 'react'
import {
  CheckCircleIcon,
  FileTextIcon,
  GraduationCapIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { Textarea } from '@/components/ui/Textarea'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'
import {
  calculateApplicantAge,
  formatAdmissionStatus,
  getAdmissionStatusTone,
} from '../utils/admissionsPipelineUtils'
import { AdmissionReviewDetails } from './AdmissionReviewDetails'

type Props = {
  application: AdmissionApplication | null
  open: boolean
  onClose: () => void
  onUpdateStatus: (
    id: string,
    status: 'under-review' | 'approved' | 'rejected',
    notes: string,
  ) => Promise<void>
  onEnrollClick: (application: AdmissionApplication) => void
  isSubmitting: boolean
}

export function AdmissionReviewDrawer({
  application,
  open,
  onClose,
  onUpdateStatus,
  onEnrollClick,
  isSubmitting,
}: Props) {
  const [notes, setNotes] = useState(application?.reviewerNotes ?? '')

  if (!application) return null

  const age = calculateApplicantAge(application.student.dateOfBirth)

  const handleApprove = async () => {
    await onUpdateStatus(application._id, 'approved', notes)
    onClose()
  }

  const handleReject = async () => {
    await onUpdateStatus(application._id, 'rejected', notes)
    onClose()
  }

  const handleSetUnderReview = async () => {
    await onUpdateStatus(application._id, 'under-review', notes)
    onClose()
  }

  return (
    <Drawer
      title={`Application ${application.applicationNo}`}
      description={`Submitted on ${new Date(application.appliedAt).toLocaleDateString()}`}
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      side="end"
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {application.status !== 'under-review' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  void handleSetUnderReview()
                }}
                disabled={isSubmitting}
              >
                Mark Under Review
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {application.status !== 'rejected' && application.status !== 'enrolled' && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  void handleReject()
                }}
                disabled={isSubmitting}
                className="flex items-center gap-1.5"
              >
                <XCircleIcon className="h-4 w-4" />
                Reject
              </Button>
            )}

            {application.status !== 'approved' && application.status !== 'enrolled' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  void handleApprove()
                }}
                disabled={isSubmitting}
                className="flex items-center gap-1.5"
              >
                <CheckCircleIcon className="h-4 w-4" weight="bold" />
                Approve Application
              </Button>
            )}

            {application.status === 'approved' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose()
                  onEnrollClick(application)
                }}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <GraduationCapIcon className="h-4 w-4" weight="bold" />
                Enroll Student
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6 text-sm">
        {/* Applicant Header Card */}
        <div className="flex items-center gap-3.5 rounded-lg border border-line bg-surface p-3.5">
          <Avatar
            name={`${application.student.firstName} ${application.student.lastName}`}
            src={application.student.photoUrl}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <p className="font-bold text-ink text-base">
                {application.student.firstName}{' '}
                {application.student.middleName ? `${application.student.middleName} ` : ''}
                {application.student.lastName}
              </p>
              <Badge tone={getAdmissionStatusTone(application.status)}>
                {formatAdmissionStatus(application.status)}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              Grade {application.student.gradeApplied} · {application.student.gender} · {age} years
              {application.academic?.admissionNo ? ` · ${application.academic.admissionNo}` : ''}
            </p>
          </div>
        </div>

        {/* Complete 7-Step Details (Academic, Personal, Parents, Health, Bank, Fees, Custom Fields) */}
        <AdmissionReviewDetails application={application} />

        {/* Documents Checklist */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <FileTextIcon className="h-4 w-4 text-primary" weight="bold" />
            <span>Submitted Documents</span>
          </div>
          <div className="flex flex-col gap-2">
            {application.documents.length === 0 ? (
              <p className="text-xs text-ink-muted italic">No documents submitted.</p>
            ) : (
              application.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md border border-line bg-surface p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4 text-ink-muted" />
                    <span className="font-medium text-ink">{doc.name}</span>
                  </div>
                  <Badge
                    tone={
                      doc.status === 'verified'
                        ? 'success'
                        : doc.status === 'rejected'
                          ? 'danger'
                          : doc.status === 'submitted'
                            ? 'planned'
                            : 'neutral'
                    }
                  >
                    {doc.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reviewer Notes */}
        <Textarea
          id="reviewer-notes"
          label="Reviewer Remarks & Audit Notes"
          rows={3}
          placeholder="Add internal verification notes or admission committee decisions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </Drawer>
  )
}
