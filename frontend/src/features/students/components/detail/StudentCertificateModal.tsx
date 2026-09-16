import { PrinterIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { formatDate } from '@/lib/format'
import type { StudentDetail } from '../../types/student.types'
import { formatClassSection } from '../../utils/studentStatus'

type StudentCertificateModalProps = {
  student: StudentDetail
  open: boolean
  onClose: () => void
}

export function StudentCertificateModal({ student, open, onClose }: StudentCertificateModalProps) {
  const handlePrint = () => {
    window.print()
  }

  const certificateNo = `TC-2026-${student.admissionNo.replace(/[^0-9]/g, '') || '001'}`
  const todayStr = '2026-09-14'

  return (
    <Dialog
      title="Transfer & Leaving Certificate"
      description={`Official institutional leaving certificate for ${student.name}.`}
      open={open}
      onOpenChange={(next) => !next && onClose()}
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <PrinterIcon className="mr-1.5 size-4" aria-hidden="true" />
            Print Certificate
          </Button>
        </div>
      }
    >
      <div className="py-3">
        <div className="mx-auto max-w-2xl rounded-lg border-2 border-line bg-surface p-6 font-serif shadow-xs">
          {/* Institution Header */}
          <div className="border-b-2 border-line pb-4 text-center font-sans">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center">
              <img
                src="/skooly-logo.jpg"
                alt="Skooly"
                className="size-12 rounded-lg object-cover ring-1 ring-line"
              />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-ink">
              SKOOLY INTERNATIONAL SCHOOL
            </h3>
            <p className="text-xs text-ink-muted">
              Affiliated to State Educational Board · School Code: SKL-4092
            </p>
            <p className="text-xs text-ink-muted">
              MG Road Campus, Bengaluru - 560001 · Contact: info@skooly.edu
            </p>
            <div className="mt-3 inline-block rounded-md border border-line bg-canvas px-3 py-1 font-sans text-xs font-semibold tracking-wider text-ink uppercase">
              TRANSFER / LEAVING CERTIFICATE
            </div>
          </div>

          {/* Certificate Metadata */}
          <div className="mt-4 flex justify-between border-b border-line pb-2 font-sans text-xs text-ink-muted">
            <span>
              Certificate No: <strong className="text-ink">{certificateNo}</strong>
            </span>
            <span>
              Date of Issue: <strong className="text-ink">{formatDate(todayStr)}</strong>
            </span>
          </div>

          {/* Body Content */}
          <div className="mt-6 space-y-3.5 font-sans text-sm leading-relaxed text-ink">
            <p>
              This is to certify that{' '}
              <strong className="underline decoration-line decoration-2 underline-offset-4">
                {student.name}
              </strong>
              , son / daughter of{' '}
              <strong className="underline decoration-line decoration-2 underline-offset-4">
                {student.guardianName}
              </strong>
              , bearing Admission Number{' '}
              <strong className="tabular-nums underline decoration-line decoration-2 underline-offset-4">
                {student.admissionNo}
              </strong>{' '}
              was a bonafide student of this institution.
            </p>
            <ul className="grid grid-cols-1 gap-2 pt-2 text-xs sm:grid-cols-2">
              <li className="rounded-md border border-line p-2">
                <span className="text-ink-muted">Class & Section:</span>{' '}
                <span className="font-semibold text-ink">{formatClassSection(student)}</span>
              </li>
              <li className="rounded-md border border-line p-2">
                <span className="text-ink-muted">Date of Birth:</span>{' '}
                <span className="font-semibold text-ink tabular-nums">
                  {formatDate(student.dob)}
                </span>
              </li>
              <li className="rounded-md border border-line p-2">
                <span className="text-ink-muted">Admission Date:</span>{' '}
                <span className="font-semibold text-ink tabular-nums">
                  {formatDate(student.admissionDate)}
                </span>
              </li>
              <li className="rounded-md border border-line p-2">
                <span className="text-ink-muted">Fee Status:</span>{' '}
                <span className="font-semibold text-ink capitalize">
                  {student.feeStatus === 'paid' ? 'Cleared (No Dues)' : 'Pending clearance'}
                </span>
              </li>
              <li className="rounded-md border border-line p-2">
                <span className="text-ink-muted">General Conduct:</span>{' '}
                <span className="font-semibold text-ink">Good</span>
              </li>
              <li className="rounded-md border border-line p-2">
                <span className="text-ink-muted">Attendance Percentage:</span>{' '}
                <span className="font-semibold text-ink tabular-nums">
                  {student.attendanceSummary.percentage}%
                </span>
              </li>
            </ul>
            <p className="pt-2 text-xs text-ink-muted">
              Reason for leaving: Successful course completion / Parent request for relocation.
            </p>
          </div>

          {/* Seal & Signatures */}
          <div className="mt-8 flex items-end justify-between pt-4 font-sans text-xs">
            <div className="text-center">
              <div className="mx-auto h-10 w-24 border-b border-line" />
              <span className="mt-1 block text-ink-muted">Class Teacher</span>
            </div>
            <div className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-dashed border-control text-[10px] text-ink-muted">
                School Seal
              </div>
            </div>
            <div className="text-center">
              <div className="mx-auto h-10 w-24 border-b border-line" />
              <span className="mt-1 block text-ink-muted">Principal</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
