import { UserIcon } from '@phosphor-icons/react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'
import type { AdmissionFormValues } from '../../types/admission.types'
import { PhotoField } from '../PhotoField'

const copy = {
  father: {
    heading: 'Father details',
    name: 'Father Name',
    phone: 'Father Phone',
    photo: 'Father Photo',
    namePlaceholder: 'e.g. Rajesh',
    occupationPlaceholder: 'e.g. Engineer',
  },
  mother: {
    heading: 'Mother details',
    name: 'Mother Name',
    phone: 'Mother Phone',
    photo: 'Mother Photo',
    namePlaceholder: 'e.g. Meena',
    occupationPlaceholder: 'e.g. Teacher',
  },
}

type ParentPersonFieldsProps = {
  parent: 'father' | 'mother'
  /** Name and phone are required for whoever is the primary guardian. */
  required: boolean
}

/** Father or mother details, in the same layout. Annual income is asked for the father only. */
export function ParentPersonFields({ parent, required }: ParentPersonFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const fieldErrors = errors.parents
  const text = copy[parent]

  return (
    <section aria-labelledby={`${parent}-heading`} className="grid gap-4">
      <SectionHeading id={`${parent}-heading`} icon={UserIcon} tone="muted">
        {text.heading}
      </SectionHeading>
      <div className="grid gap-x-4 gap-y-3.5 @2xl:grid-cols-3">
        <Input
          label={text.name}
          required={required}
          autoComplete="off"
          placeholder={text.namePlaceholder}
          error={fieldErrors?.[`${parent}Name`]?.message}
          {...register(`parents.${parent}Name`)}
        />
        <Input
          label="Middle Name"
          autoComplete="off"
          placeholder="e.g. Kumar"
          error={fieldErrors?.[`${parent}MiddleName`]?.message}
          {...register(`parents.${parent}MiddleName`)}
        />
        <Input
          label={text.phone}
          type="tel"
          inputMode="tel"
          required={required}
          autoComplete="off"
          placeholder="e.g. 98765 43210"
          error={fieldErrors?.[`${parent}Phone`]?.message}
          {...register(`parents.${parent}Phone`)}
        />
      </div>
      <div
        className={cn(
          'grid gap-x-4 gap-y-3.5 @2xl:grid-cols-3',
          parent === 'father' && '@xl:grid-cols-2 @2xl:grid-cols-2 @4xl:grid-cols-4',
        )}
      >
        <Input
          label="Occupation"
          autoComplete="off"
          placeholder={text.occupationPlaceholder}
          error={fieldErrors?.[`${parent}Occupation`]?.message}
          {...register(`parents.${parent}Occupation`)}
        />
        <Input
          label="Qualification"
          autoComplete="off"
          placeholder="e.g. B.Com"
          error={fieldErrors?.[`${parent}Qualification`]?.message}
          {...register(`parents.${parent}Qualification`)}
        />
        <Input
          label="Aadhaar No."
          inputMode="numeric"
          autoComplete="off"
          placeholder="e.g. 1234 5678 9012"
          error={fieldErrors?.[`${parent}Aadhaar`]?.message}
          {...register(`parents.${parent}Aadhaar`)}
        />
        {parent === 'father' && (
          <Input
            label="Annual Income (₹)"
            inputMode="decimal"
            autoComplete="off"
            placeholder="e.g. 350000"
            error={fieldErrors?.fatherIncome?.message}
            {...register('parents.fatherIncome')}
          />
        )}
      </div>
      <PhotoField name={`parents.${parent}Photo`} label={text.photo} />
    </section>
  )
}
