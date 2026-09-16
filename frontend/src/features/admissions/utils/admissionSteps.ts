import { ADMISSION_STEPS } from '../constants'
import type { AdmissionStep } from '../types/admission.types'

export const stepIndex = (step: AdmissionStep) => ADMISSION_STEPS.indexOf(step)

export const nextStep = (step: AdmissionStep): AdmissionStep | null =>
  ADMISSION_STEPS[stepIndex(step) + 1] ?? null

export const previousStep = (step: AdmissionStep): AdmissionStep | null =>
  ADMISSION_STEPS[stepIndex(step) - 1] ?? null

export const isLastStep = (step: AdmissionStep) => nextStep(step) === null

/** Share of steps reached, counting the current one: 20% on the first of five. */
export const stepProgress = (step: AdmissionStep) =>
  Math.round(((stepIndex(step) + 1) / ADMISSION_STEPS.length) * 100)

/** The earliest step with a validation error, to send the user back to it. */
export const firstStepWithErrors = (errors: Partial<Record<AdmissionStep, unknown>>) =>
  ADMISSION_STEPS.find((step) => errors[step] !== undefined) ?? null
