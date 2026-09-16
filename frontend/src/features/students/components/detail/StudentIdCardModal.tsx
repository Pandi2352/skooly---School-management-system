import { PrinterIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { getInitials } from '@/lib/getInitials'
import type { StudentDetail } from '../../types/student.types'
import { formatClassSection } from '../../utils/studentStatus'

type StudentIdCardModalProps = {
  student: StudentDetail
  open: boolean
  onClose: () => void
}

export function StudentIdCardModal({ student, open, onClose }: StudentIdCardModalProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog
      title="Student Identity Card"
      description={`Printable photo identification card for ${student.name}.`}
      open={open}
      onOpenChange={(next) => !next && onClose()}
      size="md"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <PrinterIcon className="mr-1.5 size-4" aria-hidden="true" />
            Print Card
          </Button>
        </div>
      }
    >
      <div className="flex justify-center py-2">
        {/* Physical ID Card Mockup */}
        <div className="w-full max-w-sm rounded-lg border-2 border-line bg-surface p-4 shadow-sm">
          {/* Card Header */}
          <div className="flex items-center gap-2.5 border-b border-line pb-3">
            <img
              src="/skooly-logo.jpg"
              alt="Skooly logo"
              className="size-9 rounded-md object-cover ring-1 ring-line"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm leading-tight font-bold tracking-tight text-ink">
                SKOOLY INTERNATIONAL SCHOOL
              </h4>
              <p className="text-[10px] leading-tight tracking-wider text-ink-muted uppercase">
                Academic Session 2026–2027
              </p>
            </div>
          </div>

          {/* Card Body */}
          <div className="mt-4 flex gap-4">
            <div className="flex size-24 flex-none flex-col items-center justify-center rounded-md border border-line bg-canvas text-xl font-bold text-ink-muted">
              {getInitials(student.name)}
            </div>
            <div className="grid flex-1 gap-1 text-xs">
              <div className="text-sm font-bold text-ink">{student.name}</div>
              <div className="text-ink-muted">
                <span className="font-medium text-ink">Admission No:</span>{' '}
                <span className="font-semibold tabular-nums">{student.admissionNo}</span>
              </div>
              <div className="text-ink-muted">
                <span className="font-medium text-ink">Class & Sec:</span>{' '}
                <span>{formatClassSection(student)}</span>
              </div>
              <div className="text-ink-muted">
                <span className="font-medium text-ink">Roll No:</span>{' '}
                <span className="tabular-nums">{student.rollNo}</span>
              </div>
              <div className="text-ink-muted">
                <span className="font-medium text-ink">Blood Group:</span>{' '}
                <span className="font-semibold text-danger">{student.bloodGroup}</span>
              </div>
              <div className="text-ink-muted">
                <span className="font-medium text-ink">Emergency:</span>{' '}
                <span className="tabular-nums">{student.guardianPhone}</span>
              </div>
            </div>
          </div>

          {/* Card Footer Barcode & Signature */}
          <div className="mt-4 flex items-end justify-between border-t border-line pt-3 text-[10px] text-ink-muted">
            <div>
              <div className="flex h-6 w-28 items-center justify-center bg-ink/10 font-mono text-[9px] tracking-widest text-ink">
                |||| | ||||| | ||
              </div>
              <span className="mt-0.5 block font-mono text-[9px] tabular-nums">
                {student.admissionNo}
              </span>
            </div>
            <div className="text-end">
              <div className="h-6 w-20 border-b border-ink/40" />
              <span className="mt-0.5 block text-[9px]">Principal</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
