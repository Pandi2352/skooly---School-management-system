import { PhoneIcon, UserIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GUARDIAN_OPTIONS, PARENT_ACCOUNT_OPTIONS } from '../../constants'
import type { AdmissionFormValues } from '../../types/admission.types'
import { ExistingParentSearch } from '../parents/ExistingParentSearch'
import { ParentAddressFields } from '../parents/ParentAddressFields'
import { ParentPersonFields } from '../parents/ParentPersonFields'

export function ParentsStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const accountMode = useWatch({ control, name: 'parents.accountMode' })
  const guardian = useWatch({ control, name: 'parents.guardian' })
  const fieldErrors = errors.parents

  return (
    <div className="grid gap-6">
      <section aria-labelledby="parents-heading" className="grid gap-4">
        <SectionHeading id="parents-heading" icon={UsersThreeIcon}>
          Parent & guardian details
        </SectionHeading>
        <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3">
          <Controller
            control={control}
            name="parents.accountMode"
            render={({ field }) => (
              <RadioGroup
                label="Parent Account Options"
                options={PARENT_ACCOUNT_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </div>
      </section>

      {accountMode === 'existing' ? (
        <ExistingParentSearch />
      ) : (
        <>
          <div className="rounded-md border border-line bg-canvas px-4 py-2">
            <Controller
              control={control}
              name="parents.guardian"
              render={({ field }) => (
                <RadioGroup
                  label="Primary Guardian"
                  hint="The school contacts this person first. Their name and phone number are required."
                  orientation="horizontal"
                  options={GUARDIAN_OPTIONS}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>

          <ParentPersonFields parent="father" required={guardian === 'father'} />
          <ParentPersonFields parent="mother" required={guardian === 'mother'} />

          {guardian === 'other' && (
            <section aria-labelledby="guardian-heading" className="grid gap-4">
              <SectionHeading id="guardian-heading" icon={UserIcon} tone="muted">
                Guardian details
              </SectionHeading>
              <div className="grid gap-x-4 gap-y-3.5 @2xl:grid-cols-3">
                <Input
                  label="Guardian Name"
                  required
                  autoComplete="off"
                  placeholder="e.g. Suresh Kumar"
                  error={fieldErrors?.guardianName?.message}
                  {...register('parents.guardianName')}
                />
                <Input
                  label="Relation to Student"
                  required
                  autoComplete="off"
                  placeholder="e.g. Uncle"
                  error={fieldErrors?.guardianRelation?.message}
                  {...register('parents.guardianRelation')}
                />
                <Input
                  label="Guardian Phone"
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="off"
                  placeholder="e.g. 98765 43210"
                  error={fieldErrors?.guardianPhone?.message}
                  {...register('parents.guardianPhone')}
                />
              </div>
            </section>
          )}

          <div className="rounded-md border border-line bg-canvas p-4">
            <Input
              label="Parent Account Login Email"
              type="email"
              autoComplete="off"
              placeholder="e.g. parent@example.com"
              hint="Parents will sign in to the parent portal with this email once it’s available."
              error={fieldErrors?.loginEmail?.message}
              {...register('parents.loginEmail')}
            />
          </div>

          <section aria-labelledby="emergency-heading" className="grid gap-4">
            <SectionHeading id="emergency-heading" icon={PhoneIcon} tone="muted">
              Emergency contact
            </SectionHeading>
            <div className="grid gap-x-4 gap-y-3.5 @xl:grid-cols-2">
              <Input
                label="Emergency Contact Name"
                autoComplete="off"
                placeholder="e.g. Anita Sharma"
                error={fieldErrors?.emergencyName?.message}
                {...register('parents.emergencyName')}
              />
              <Input
                label="Emergency Contact Phone"
                type="tel"
                inputMode="tel"
                autoComplete="off"
                placeholder="e.g. 98765 43210"
                error={fieldErrors?.emergencyPhone?.message}
                {...register('parents.emergencyPhone')}
              />
            </div>
          </section>

          <ParentAddressFields />
        </>
      )}
    </div>
  )
}
