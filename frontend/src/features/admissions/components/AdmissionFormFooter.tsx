import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import type { AdmissionStep } from '../types/admission.types'
import { isLastStep, previousStep } from '../utils/admissionSteps'

type AdmissionFormFooterProps = {
  step: AdmissionStep
  submitting: boolean
  onPrevious: () => void
}

/**
 * Next Step and Admit Student are both submit buttons; the form decides whether to move on or admit.
 * The bar sticks to the bottom of the screen so long steps never hide it.
 */
export function AdmissionFormFooter({ step, submitting, onPrevious }: AdmissionFormFooterProps) {
  const last = isLastStep(step)

  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-b-md border-t border-line bg-surface px-4 py-3 @xl:px-5">
      {previousStep(step) === null ? (
        <span />
      ) : (
        <Button variant="secondary" disabled={submitting} onClick={onPrevious}>
          <ArrowLeftIcon className="size-4" weight="bold" aria-hidden="true" />
          Previous
        </Button>
      )}
      <Button type="submit" loading={submitting}>
        {last ? (
          <>
            {!submitting && (
              <CheckCircleIcon className="size-4.5" weight="fill" aria-hidden="true" />
            )}
            Admit Student
          </>
        ) : (
          <>
            Next Step
            <ArrowRightIcon className="size-4" weight="bold" aria-hidden="true" />
          </>
        )}
      </Button>
    </div>
  )
}
