import { useState } from 'react'
import { GraduationCapIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Select } from '@/components/ui/Select'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'

type Props = {
  application: AdmissionApplication | null
  open: boolean
  onClose: () => void
  onConfirmEnroll: (id: string, section: string) => Promise<void>
  isEnrolling: boolean
}

const sectionOptions = [
  { value: 'A', label: 'Section A' },
  { value: 'B', label: 'Section B' },
  { value: 'C', label: 'Section C' },
  { value: 'D', label: 'Section D' },
]

export function EnrollApplicantDialog({
  application,
  open,
  onClose,
  onConfirmEnroll,
  isEnrolling,
}: Props) {
  const [section, setSection] = useState('A')

  if (!application) return null

  const handleEnroll = async () => {
    await onConfirmEnroll(application._id, section)
    onClose()
  }

  return (
    <Dialog
      title="Enroll Approved Student"
      description="Confirm class section placement to create student record in active school roster."
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      size="sm"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isEnrolling}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              void handleEnroll()
            }}
            disabled={isEnrolling}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <GraduationCapIcon className="h-4 w-4" weight="bold" />
            {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2 text-sm">
        <div className="rounded-md border border-line bg-canvas p-3">
          <p className="font-semibold text-ink">
            {application.student.firstName} {application.student.lastName}
          </p>
          <p className="text-xs text-ink-muted">
            Application #{application.applicationNo} • Grade {application.student.gradeApplied}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Select
            label="Assign Class Section"
            value={section}
            onValueChange={(val: string) => setSection(val)}
            options={sectionOptions}
          />
          <span className="text-[0.75rem] text-ink-muted">
            The student will be enrolled into Grade {application.student.gradeApplied}-{section} with an automatic admission number.
          </span>
        </div>
      </div>
    </Dialog>
  )
}
