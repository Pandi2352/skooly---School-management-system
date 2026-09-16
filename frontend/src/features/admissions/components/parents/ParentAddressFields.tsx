import { MapPinIcon } from '@phosphor-icons/react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Checkbox } from '@/components/ui/Checkbox'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Textarea } from '@/components/ui/Textarea'
import type { AdmissionFormValues } from '../../types/admission.types'

const ADDRESS_PLACEHOLDER = 'House, street, area, city and PIN code'

export function ParentAddressFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const sameAsGuardian = useWatch({ control, name: 'parents.sameAsGuardianAddress' })
  const fieldErrors = errors.parents

  return (
    <section aria-labelledby="address-heading" className="grid gap-4">
      <SectionHeading id="address-heading" icon={MapPinIcon} tone="muted">
        Address
      </SectionHeading>
      <Textarea
        label="Guardian Address"
        rows={2}
        placeholder={ADDRESS_PLACEHOLDER}
        error={fieldErrors?.guardianAddress?.message}
        {...register('parents.guardianAddress')}
      />
      <Controller
        control={control}
        name="parents.sameAsGuardianAddress"
        render={({ field }) => (
          <Checkbox
            label="Permanent address is the same as the guardian address"
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
          />
        )}
      />
      <div className="grid gap-x-4 gap-y-3.5 @xl:grid-cols-2">
        <Textarea
          label="Current Address"
          rows={3}
          placeholder={ADDRESS_PLACEHOLDER}
          error={fieldErrors?.currentAddress?.message}
          {...register('parents.currentAddress')}
        />
        {/* Read-only rather than disabled: react-hook-form drops disabled fields' values. */}
        <Textarea
          label="Permanent Address"
          rows={3}
          readOnly={sameAsGuardian}
          placeholder={sameAsGuardian ? 'Same as the guardian address' : ADDRESS_PLACEHOLDER}
          className={sameAsGuardian ? 'bg-canvas text-ink-muted' : undefined}
          error={fieldErrors?.permanentAddress?.message}
          {...register('parents.permanentAddress')}
        />
      </div>
    </section>
  )
}
