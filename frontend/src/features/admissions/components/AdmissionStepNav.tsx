import {
  BankIcon,
  CheckCircleIcon,
  CurrencyInrIcon,
  FolderOpenIcon,
  GraduationCapIcon,
  HeartbeatIcon,
  UserIcon,
  UsersThreeIcon,
  type Icon,
} from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { ADMISSION_STEP_LABELS, ADMISSION_STEPS } from '../constants'
import type { AdmissionStep } from '../types/admission.types'

const stepIcons: Record<AdmissionStep, Icon> = {
  academic: GraduationCapIcon,
  personal: UserIcon,
  parents: UsersThreeIcon,
  health: HeartbeatIcon,
  bank: BankIcon,
  fees: CurrencyInrIcon,
  documents: FolderOpenIcon,
}

type AdmissionStepNavProps = {
  current: AdmissionStep
  /** Steps before this index have been passed with Next Step and show a tick. */
  furthestIndex: number
  /** Any step can be opened (owner's choice for now); all are locked once the admission is submitted. */
  locked: boolean
  onSelect: (step: AdmissionStep) => void
}

export function AdmissionStepNav({
  current,
  furthestIndex,
  locked,
  onSelect,
}: AdmissionStepNavProps) {
  const listRef = useRef<HTMLOListElement>(null)

  // Below xl the steps scroll sideways; keep the current one in view. Only the list scrolls, never
  // the page, so the step's own "scroll to top" isn't undone.
  useEffect(() => {
    const list = listRef.current
    const button = list?.querySelector<HTMLElement>('[aria-current="step"]')
    if (!list || !button || list.scrollWidth <= list.clientWidth) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({
      left: button.offsetLeft - (list.clientWidth - button.offsetWidth) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [current])

  return (
    <nav aria-label="Admission steps" className="min-w-0">
      <ol
        ref={listRef}
        className="relative flex gap-2 overflow-x-auto pb-1.5 xl:grid xl:overflow-visible xl:pb-0"
      >
        {ADMISSION_STEPS.map((step, index) => {
          const StepIcon = stepIcons[step]
          const isCurrent = step === current
          const isDone = index < furthestIndex && !isCurrent
          return (
            <li key={step} className="shrink-0">
              <button
                type="button"
                aria-current={isCurrent ? 'step' : undefined}
                disabled={locked}
                onClick={() => onSelect(step)}
                className={cn(
                  'flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-md border px-3 text-start text-sm font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60 pointer-coarse:min-h-11',
                  isCurrent
                    ? 'border-primary bg-primary text-surface'
                    : 'border-line bg-surface text-ink enabled:hover:border-primary/40 enabled:hover:bg-primary/5',
                )}
              >
                {isDone ? (
                  <CheckCircleIcon
                    className="size-4.5 flex-none text-success"
                    weight="fill"
                    aria-hidden="true"
                  />
                ) : (
                  <StepIcon className="size-4.5 flex-none" weight="fill" aria-hidden="true" />
                )}
                <span>
                  {index + 1}. {ADMISSION_STEP_LABELS[step]}
                </span>
                {isDone && <span className="sr-only">(done)</span>}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
