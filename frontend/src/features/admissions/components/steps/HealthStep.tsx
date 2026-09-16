import { HeartbeatIcon } from '@phosphor-icons/react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Textarea } from '@/components/ui/Textarea'
import type { AdmissionFormValues } from '../../types/admission.types'

export function HealthStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const fieldErrors = errors.health

  return (
    <section aria-labelledby="health-heading" className="grid gap-4">
      <SectionHeading id="health-heading" icon={HeartbeatIcon}>
        Health details
      </SectionHeading>
      <p className="text-sm text-ink-muted">
        All optional. Teachers see this so they can help in an emergency.
      </p>
      <div className="grid gap-x-4 gap-y-3.5 @xl:grid-cols-2">
        <Textarea
          label="Medical Conditions"
          rows={3}
          placeholder="Conditions teachers should know about, such as asthma"
          error={fieldErrors?.medicalConditions?.message}
          {...register('health.medicalConditions')}
        />
        <Textarea
          label="Allergies"
          rows={3}
          placeholder="Food, medicine or other allergies"
          error={fieldErrors?.allergies?.message}
          {...register('health.allergies')}
        />
        <Input
          label="Height (cm)"
          inputMode="decimal"
          autoComplete="off"
          placeholder="e.g. 142"
          error={fieldErrors?.heightCm?.message}
          {...register('health.heightCm')}
        />
        <Input
          label="Weight (kg)"
          inputMode="decimal"
          autoComplete="off"
          placeholder="e.g. 36.5"
          error={fieldErrors?.weightKg?.message}
          {...register('health.weightKg')}
        />
      </div>
    </section>
  )
}
