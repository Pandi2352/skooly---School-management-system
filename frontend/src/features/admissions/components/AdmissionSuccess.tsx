import { CheckCircleIcon, PlusIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import type { AdmissionResult } from '../types/admission.types'

type AdmissionSuccessProps = { result: AdmissionResult; onAdmitAnother: () => void }

export function AdmissionSuccess({ result, onAdmitAnother }: AdmissionSuccessProps) {
  return (
    <div role="status" className="grid justify-items-center gap-3 px-4 py-12 text-center">
      <CheckCircleIcon className="size-12 text-success" weight="fill" aria-hidden="true" />
      <h2 className="text-lg font-bold text-ink">Student admitted</h2>
      <p className="max-w-lg text-ink-muted">
        {result.studentName} is admitted to Class {result.grade}, section {result.section}, with
        admission number <strong className="font-semibold text-ink">{result.admissionNo}</strong>{' '}
        and roll number <strong className="font-semibold text-ink">{result.rollNo}</strong>.
      </p>
      <p className="max-w-lg text-sm text-ink-muted">
        Sample data: this admission isn’t sent to a server and resets when the page reloads.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Button onClick={onAdmitAnother}>
          <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
          Admit another student
        </Button>
        <Link to={paths.students} className={buttonClasses({ variant: 'secondary' })}>
          Go to Student List
        </Link>
      </div>
    </div>
  )
}
