import { FileTextIcon, IdentificationCardIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getInitials } from '@/lib/getInitials'
import type { EnrollmentStatus, FeeStatus, StudentDetail } from '../../types/student.types'
import {
  admissionNeedsAttention,
  feeNeedsAttention,
  formatClassSection,
} from '../../utils/studentStatus'
import { StudentCertificateModal } from './StudentCertificateModal'
import { StudentIdCardModal } from './StudentIdCardModal'

type StudentHeaderProps = {
  student: StudentDetail
}

const enrollmentLabels: Record<EnrollmentStatus, string> = {
  enrolled: 'Enrolled',
  pending: 'Pending Admission',
  left: 'Left Institution',
}

const feeLabels: Record<FeeStatus, string> = {
  paid: 'Fees Cleared',
  due: 'Fees Due',
  overdue: 'Fees Overdue',
}

const enrollmentTone = (status: EnrollmentStatus): BadgeTone =>
  admissionNeedsAttention(status) ? 'planned' : 'neutral'

const feeTone = (status: FeeStatus): BadgeTone => {
  if (status === 'overdue') return 'danger'
  return feeNeedsAttention(status) ? 'planned' : 'neutral'
}

export function StudentHeader({ student }: StudentHeaderProps) {
  const [isIdCardOpen, setIsIdCardOpen] = useState(false)
  const [isCertificateOpen, setIsCertificateOpen] = useState(false)

  const isAttendanceAtRisk = student.attendanceSummary.percentage < 75

  return (
    <>
      <div className="rounded-lg border border-line bg-surface p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Student Profile Info */}
          <div className="flex items-start gap-4">
            <div className="flex size-16 flex-none items-center justify-center rounded-lg border border-line bg-canvas text-xl font-bold text-ink-muted ring-1 ring-line sm:size-20 sm:text-2xl">
              {getInitials(student.name)}
            </div>
            <div className="grid min-w-0 gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl leading-tight font-bold tracking-tight text-ink sm:text-2xl">
                  {student.name}
                </h2>
                <Badge tone={enrollmentTone(student.enrollmentStatus)}>
                  {enrollmentLabels[student.enrollmentStatus]}
                </Badge>
                <Badge tone={feeTone(student.feeStatus)}>{feeLabels[student.feeStatus]}</Badge>
                {isAttendanceAtRisk && (
                  <Badge tone="danger">
                    Attendance at Risk ({student.attendanceSummary.percentage}%)
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                <span>
                  Admission No:{' '}
                  <strong className="font-semibold text-ink tabular-nums">
                    {student.admissionNo}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Class:{' '}
                  <strong className="font-semibold text-ink">{formatClassSection(student)}</strong>
                </span>
                <span>•</span>
                <span>
                  Roll No:{' '}
                  <strong className="font-semibold text-ink tabular-nums">{student.rollNo}</strong>
                </span>
                <span>•</span>
                <span>
                  Blood Group:{' '}
                  <strong className="font-semibold text-ink">{student.bloodGroup}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-start">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsIdCardOpen(true)}
              aria-label="Print Student ID Card"
            >
              <IdentificationCardIcon className="mr-1.5 size-4" aria-hidden="true" />
              ID Card
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCertificateOpen(true)}
              aria-label="View Transfer Certificate"
            >
              <FileTextIcon className="mr-1.5 size-4" aria-hidden="true" />
              Certificate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled
              title="Edit form coming in Phase 1 next release"
              aria-label="Edit Student Profile (Coming soon)"
            >
              <PencilSimpleIcon className="mr-1.5 size-4" aria-hidden="true" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <StudentIdCardModal
        student={student}
        open={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
      />
      <StudentCertificateModal
        student={student}
        open={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />
    </>
  )
}
