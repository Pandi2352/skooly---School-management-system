import { ADMISSION_STEP_LABELS, ADMISSION_STEPS } from '../constants'
import type { AdmissionStep } from '../types/admission.types'
import { stepIndex, stepProgress } from '../utils/admissionSteps'

type AdmissionProgressProps = { step: AdmissionStep; complete: boolean }

/** Striped bar like the owner's reference, with the step named in text too. */
export function AdmissionProgress({ step, complete }: AdmissionProgressProps) {
  const percent = complete ? 100 : stepProgress(step)

  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <span className="font-semibold text-ink">
          {complete
            ? 'Admission submitted'
            : `Step ${String(stepIndex(step) + 1)} of ${String(ADMISSION_STEPS.length)}: ${ADMISSION_STEP_LABELS[step]}`}
        </span>
        <span className="text-ink-muted tabular-nums">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Admission progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2.5 overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-primary bg-[repeating-linear-gradient(-45deg,transparent_0_6px,rgb(255_255_255/0.25)_6px_12px)] transition-[width] duration-300 motion-reduce:transition-none"
          // Width follows the step, so it's computed.
          style={{ width: `${String(percent)}%` }}
        />
      </div>
    </div>
  )
}
