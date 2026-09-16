import { UserIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Select } from '@/components/ui/Select'
import {
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
  RELIGION_OPTIONS,
  SOCIAL_CATEGORY_OPTIONS,
} from '../../constants'
import { useHouseOptions } from '../../hooks/useHouseOptions'
import type { AdmissionFormValues } from '../../types/admission.types'
import { toDateInputValue } from '../../utils/dates'
import { PhotoField } from '../PhotoField'

// Columns follow the form panel's width (@container in AdmissionForm).
const fourColumns = 'grid gap-x-4 gap-y-3.5 @xl:grid-cols-2 @4xl:grid-cols-4'

export function PersonalInfoStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const [today] = useState(() => new Date())
  const houses = useHouseOptions()
  const fieldErrors = errors.personal

  return (
    <section aria-labelledby="personal-heading" className="grid gap-4">
      <SectionHeading id="personal-heading" icon={UserIcon}>
        Student details
      </SectionHeading>

      <div className="grid gap-x-4 gap-y-3.5 @2xl:grid-cols-3">
        <Input
          label="First Name"
          required
          autoComplete="off"
          placeholder="e.g. Priya"
          error={fieldErrors?.firstName?.message}
          {...register('personal.firstName')}
        />
        <Input
          label="Middle Name"
          autoComplete="off"
          placeholder="e.g. Devi"
          error={fieldErrors?.middleName?.message}
          {...register('personal.middleName')}
        />
        <Input
          label="Last Name"
          autoComplete="off"
          placeholder="e.g. Sharma"
          error={fieldErrors?.lastName?.message}
          {...register('personal.lastName')}
        />
      </div>

      <div className={fourColumns}>
        <Controller
          control={control}
          name="personal.gender"
          render={({ field }) => (
            <Select
              label="Gender"
              required
              placeholder="Select gender"
              options={GENDER_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
              error={fieldErrors?.gender?.message}
            />
          )}
        />
        <Input
          label="Date of Birth"
          type="date"
          required
          max={toDateInputValue(today)}
          error={fieldErrors?.dateOfBirth?.message}
          {...register('personal.dateOfBirth')}
        />
        <Controller
          control={control}
          name="personal.category"
          render={({ field }) => (
            <Select
              label="Category"
              placeholder="Select category"
              options={SOCIAL_CATEGORY_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="personal.house"
          render={({ field }) => (
            <Select
              label="House"
              placeholder={houses.isPending ? 'Loading houses…' : 'Select house'}
              options={houses.data ?? []}
              value={field.value}
              disabled={!houses.isSuccess}
              error={
                houses.isError ? 'Couldn’t load houses. Reload the page to try again.' : undefined
              }
              onValueChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="personal.bloodGroup"
          render={({ field }) => (
            <Select
              label="Blood Group"
              placeholder="Select blood group"
              options={BLOOD_GROUP_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="personal.religion"
          render={({ field }) => (
            <Select
              label="Religion"
              placeholder="Select religion"
              options={RELIGION_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        <Input
          label="Aadhaar / National ID"
          autoComplete="off"
          placeholder="e.g. 1234 5678 9012"
          error={fieldErrors?.nationalId?.message}
          {...register('personal.nationalId')}
        />
        <Input
          label="PEN / SSSM ID"
          autoComplete="off"
          placeholder="e.g. 20123456789"
          error={fieldErrors?.penId?.message}
          {...register('personal.penId')}
        />

        <Input
          label="Caste"
          autoComplete="off"
          placeholder="As on the caste certificate"
          error={fieldErrors?.caste?.message}
          {...register('personal.caste')}
        />
        <Input
          label="Sub-Caste"
          autoComplete="off"
          placeholder="As on the caste certificate"
          error={fieldErrors?.subCaste?.message}
          {...register('personal.subCaste')}
        />
        <Input
          label="Mother Tongue"
          autoComplete="off"
          placeholder="e.g. Tamil"
          error={fieldErrors?.motherTongue?.message}
          {...register('personal.motherTongue')}
        />
        <Input
          label="Place of Birth"
          autoComplete="off"
          placeholder="e.g. Chennai"
          error={fieldErrors?.placeOfBirth?.message}
          {...register('personal.placeOfBirth')}
        />
      </div>

      <div className="grid items-end gap-x-4 gap-y-3.5 @xl:grid-cols-2">
        <Input
          label="Nationality"
          autoComplete="off"
          placeholder="e.g. Indian"
          error={fieldErrors?.nationality?.message}
          {...register('personal.nationality')}
        />
        <div className="flex flex-wrap gap-x-6">
          <Controller
            control={control}
            name="personal.belowPovertyLine"
            render={({ field }) => (
              <Checkbox
                label="Below Poverty Line (BPL)"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
          <Controller
            control={control}
            name="personal.rightToEducation"
            render={({ field }) => (
              <Checkbox
                label="RTE (Right to Education)"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
        </div>
        <Input
          label="Student Phone (Optional)"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="e.g. 98765 43210"
          error={fieldErrors?.phone?.message}
          {...register('personal.phone')}
        />
        <Input
          label="Student Email (Optional)"
          type="email"
          autoComplete="off"
          placeholder="e.g. student@example.com"
          error={fieldErrors?.email?.message}
          {...register('personal.email')}
        />
      </div>

      <PhotoField name="personal.photo" label="Student Photo" />
    </section>
  )
}
