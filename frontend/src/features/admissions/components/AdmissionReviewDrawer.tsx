import { useState } from 'react'
import {
  CheckCircleIcon,
  FileTextIcon,
  GraduationCapIcon,
  IdentificationCardIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
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
        {/* Status banner */}
        <div className="flex items-center justify-between rounded-md border border-line bg-canvas p-3">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Current Status
          </span>
          <Badge tone={getAdmissionStatusTone(application.status)}>
            {formatAdmissionStatus(application.status)}
          </Badge>
        </div>

        {/* Student Information Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <IdentificationCardIcon className="h-4 w-4 text-primary" weight="bold" />
            <span>Applicant Details</span>
          </div>
          <div className="rounded-md border border-line bg-surface p-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-ink-muted">Full Name:</span>
              <p className="font-semibold text-ink text-sm">
                {application.student.firstName} {application.student.lastName}
              </p>
            </div>
            <div>
              <span className="text-ink-muted">Grade Applied:</span>
              <p className="font-semibold text-ink text-sm">
                Grade {application.student.gradeApplied}
              </p>
            </div>
            <div>
              <span className="text-ink-muted">Date of Birth:</span>
              <p className="font-medium text-ink">
                {application.student.dateOfBirth} ({age} years)
              </p>
            </div>
            <div>
              <span className="text-ink-muted">Gender:</span>
              <p className="font-medium text-ink capitalize">{application.student.gender}</p>
            </div>
            <div>
              <span className="text-ink-muted">Blood Group:</span>
              <p className="font-medium text-ink">{application.student.bloodGroup || '—'}</p>
            </div>
            <div>
              <span className="text-ink-muted">Previous School:</span>
              <p className="font-medium text-ink truncate">
                {application.student.previousSchool || 'None / Direct Admission'}
              </p>
            </div>
          </div>
        </div>

        {/* Parent / Guardian Information */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <UserIcon className="h-4 w-4 text-primary" weight="bold" />
            <span>Parent / Guardian</span>
          </div>
          <div className="rounded-md border border-line bg-surface p-3 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink text-sm">{application.parent.name}</span>
              <span className="capitalize text-ink-muted">
                Relation: {application.parent.guardianType}
              </span>
            </div>
            <div className="flex items-center gap-2 text-ink">
              <PhoneIcon className="h-3.5 w-3.5 text-ink-muted" />
              <span>{application.parent.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-ink">
              <span className="text-ink-muted">Email:</span>
              <span>{application.parent.email}</span>
            </div>
            {application.parent.occupation && (
              <div className="flex items-center gap-2 text-ink">
                <span className="text-ink-muted">Occupation:</span>
                <span>{application.parent.occupation}</span>
              </div>
            )}
            {application.parent.address && (
              <div className="flex items-start gap-2 text-ink pt-1 border-t border-line">
                <MapPinIcon className="h-3.5 w-3.5 text-ink-muted shrink-0 mt-0.5" />
                <span className="text-ink-muted">{application.parent.address}</span>
              </div>
            )}
          </div>
        </div>

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
