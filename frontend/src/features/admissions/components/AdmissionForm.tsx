import { zodResolver } from '@hookform/resolvers/zod'
import { SparkleIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { useActiveCustomFields, validateCustomValues } from '@/features/customFields'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { ADMISSION_STEP_LABELS } from '../constants'
import { useSubmitAdmission } from '../hooks/useSubmitAdmission'
import { admissionFormSchema } from '../schemas/admission.schema'
import type { AdmissionFormValues, AdmissionResult, AdmissionStep } from '../types/admission.types'
import { createEmptyAdmission, toAdmissionRequest } from '../utils/admissionRequest'
import { getMockAdmissionBoy, getMockAdmissionGirl } from '../utils/mockAdmissionPresets'
import {
  firstStepWithErrors,
  isLastStep,
  nextStep,
  previousStep,
  stepIndex,
} from '../utils/admissionSteps'
import { AdmissionFormFooter } from './AdmissionFormFooter'
import { AdmissionProgress } from './AdmissionProgress'
import { AdmissionStepNav } from './AdmissionStepNav'
import { AdmissionSuccess } from './AdmissionSuccess'
import { AcademicStep } from './steps/AcademicStep'
import { BankStep } from './steps/BankStep'
import { DocumentsStep } from './steps/DocumentsStep'
import { FeesStep } from './steps/FeesStep'
import { HealthStep } from './steps/HealthStep'
import { ParentsStep } from './steps/ParentsStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'

const stepPanels: Record<AdmissionStep, ComponentType> = {
  academic: AcademicStep,
  personal: PersonalInfoStep,
  parents: ParentsStep,
  health: HealthStep,
  bank: BankStep,
  fees: FeesStep,
  documents: DocumentsStep,
}

// The sticky navbar (3.5rem) plus a little room; above this the step's top is hidden.
const NAVBAR_CLEARANCE_PX = 72

/**
 * One form across all the steps. Only the current step is shown, but every value stays in the
 * form, so going back never loses anything. Values live in memory only; a reload starts again.
 */
type AdmissionFormProps = {
  onRegisterFill?: (fn: (preset: 1 | 2) => void) => void
}

export function AdmissionForm({ onRegisterFill }: AdmissionFormProps = {}) {
  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: createEmptyAdmission(new Date()),
  })
  const [step, setStep] = useState<AdmissionStep>('academic')
  const [furthestIndex, setFurthestIndex] = useState(0)
  const [result, setResult] = useState<AdmissionResult | null>(null)
  const columnRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const submitAdmission = useSubmitAdmission()
  const activeCustomFields = useActiveCustomFields().data ?? []
  const { toast } = useToast()

  const fillWithPreset = useCallback(
    (preset: 1 | 2) => {
      const data = preset === 1 ? getMockAdmissionBoy() : getMockAdmissionGirl()
      form.reset(data)
      // Unlock all steps so the reviewer/tester can jump directly to any step to inspect fields
      setFurthestIndex(6)
      toast({
        tone: 'success',
        title: `Filled with ${preset === 1 ? 'Rohan Verma (Class 5 Boy)' : 'Ananya Sharma (Class 8 Girl)'}`,
        description: 'All 7 steps including student photo and documents are populated for testing.',
      })
    },
    [form, toast],
  )

  useEffect(() => {
    onRegisterFill?.(fillWithPreset)
  }, [onRegisterFill, fillWithPreset])

  const goTo = (target: AdmissionStep) => {
    setStep(target)
    setFurthestIndex((current) => Math.max(current, stepIndex(target)))
    requestAnimationFrame(() => {
      // After scrolling down a long step, bring the new step's top back into view.
      const column = columnRef.current
      if (column && column.getBoundingClientRect().top < NAVBAR_CLEARANCE_PX) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        column.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' })
      }
      // Start keyboard and screen reader users at the new step.
      panelRef.current?.focus({ preventScroll: true })
    })
  }

  const goNext = async () => {
    const valid = await form.trigger(step, { shouldFocus: true })
    const following = nextStep(step)
    if (valid && following) goTo(following)
  }

  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    void form.handleSubmit(
      async (values) => {
        // Custom field rules live in settings, so they're checked here rather than in the schema.
        const customProblems = Object.entries(
          validateCustomValues(activeCustomFields, values.documents.custom),
        )
        if (customProblems.length > 0) {
          for (const [key, message] of customProblems)
            form.setError(`documents.custom.${key}`, { message })
          goTo('documents')
          toast({
            tone: 'error',
            title: 'Some details need attention',
            description: 'Check Additional details on the Documents step.',
          })
          return
        }
        try {
          setResult(
            await submitAdmission.mutateAsync(toAdmissionRequest(values, activeCustomFields)),
          )
        } catch (error) {
          toast({
            tone: 'error',
            title: 'Couldn’t admit the student',
            description: getErrorMessage(error),
          })
        }
      },
      (errors) => {
        const stepWithErrors = firstStepWithErrors(errors)
        if (!stepWithErrors) return
        goTo(stepWithErrors)
        toast({
          tone: 'error',
          title: 'Some details need attention',
          description: `Check the ${ADMISSION_STEP_LABELS[stepWithErrors]} step.`,
        })
      },
    )(event)
  }

  const admitAnother = () => {
    form.reset(createEmptyAdmission(new Date()))
    setResult(null)
    setStep('academic')
    setFurthestIndex(0)
  }

  const StepPanel = stepPanels[step]

  return (
    // Step list beside the form only on wide screens (xl); below that it sits above as a scrolling row,
    // so the form keeps enough width next to the app sidebar.
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-5">
      <aside className="min-w-0 xl:sticky xl:top-[calc(var(--spacing-navbar)+1.25rem)]">
        <AdmissionStepNav
          current={step}
          furthestIndex={furthestIndex}
          locked={result !== null}
          onSelect={goTo}
        />
      </aside>

      <div
        ref={columnRef}
        className="grid min-w-0 scroll-mt-[calc(var(--spacing-navbar)+1rem)] gap-3"
      >
        <AdmissionProgress step={step} complete={result !== null} />

        {!result && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line bg-surface p-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-ink">
              <SparkleIcon className="size-4 text-primary" weight="fill" aria-hidden="true" />
              <span>Test data: Auto-fill every field with mock student data & photo</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => fillWithPreset(1)}
              >
                Preset 1: Rohan (Class 5 Boy)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => fillWithPreset(2)}
              >
                Preset 2: Ananya (Class 8 Girl)
              </Button>
            </div>
          </div>
        )}

        {/* @container: field grids follow the panel's own width, not the window's. */}
        <div
          ref={panelRef}
          tabIndex={-1}
          className="@container min-w-0 rounded-md border border-line bg-surface focus-visible:outline-none!"
        >
          {result ? (
            <AdmissionSuccess result={result} onAdmitAnother={admitAnother} />
          ) : (
            <FormProvider {...form}>
              <form
                noValidate
                aria-label="Student admission"
                onSubmit={(event) => {
                  if (isLastStep(step)) {
                    submit(event)
                    return
                  }
                  // Enter on an earlier step moves on instead of submitting everything.
                  event.preventDefault()
                  void goNext()
                }}
              >
                <div className="p-4 @xl:p-5">
                  <StepPanel />
                </div>
                <AdmissionFormFooter
                  step={step}
                  submitting={form.formState.isSubmitting}
                  onPrevious={() => {
                    const previous = previousStep(step)
                    if (previous) goTo(previous)
                  }}
                />
              </form>
            </FormProvider>
          )}
        </div>
      </div>
    </div>
  )
}
