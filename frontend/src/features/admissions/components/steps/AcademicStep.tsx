import { BuildingsIcon, GraduationCapIcon } from '@phosphor-icons/react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useClassOptions } from '@/features/students'
import { useAdmissionNumbers } from '../../hooks/useAdmissionNumbers'
import type { AdmissionFormValues } from '../../types/admission.types'
import { AutoFillButton } from '../AutoFillButton'

export function AcademicStep() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const classGrade = useWatch({ control, name: 'academic.classGrade' })
  const section = useWatch({ control, name: 'academic.section' })
  const classes = useClassOptions()
  const numbers = useAdmissionNumbers(classGrade === '' ? null : Number(classGrade), section)

  const classOptions = (classes.data ?? []).map((option) => ({
    value: String(option.grade),
    label: option.label,
  }))
  const sectionOptions = (
    classes.data?.find((option) => String(option.grade) === classGrade)?.sections ?? []
  ).map((name) => ({ value: name, label: name }))
  const fieldErrors = errors.academic

  const fill = (name: 'academic.admissionNo' | 'academic.rollNo', value: string | null) => {
    if (value !== null) setValue(name, value, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <div className="grid gap-6">
      <section aria-labelledby="academic-heading" className="grid gap-4">
        <SectionHeading id="academic-heading" icon={GraduationCapIcon}>
          Academic details
        </SectionHeading>
        <div className="grid gap-x-4 gap-y-3.5 @xl:grid-cols-2 @4xl:grid-cols-3">
          <Input
            label="Admission No"
            required
            autoComplete="off"
            placeholder="Type it, or press Auto"
            error={fieldErrors?.admissionNo?.message}
            endAddon={
              <AutoFillButton
                purpose="fill the next admission number"
                disabled={numbers.admissionNo === null}
                onClick={() => fill('academic.admissionNo', numbers.admissionNo)}
              />
            }
            {...register('academic.admissionNo')}
          />
          <Input
            label="Roll Number"
            required
            autoComplete="off"
            placeholder="Type it, or press Auto"
            hint={numbers.rollNo === null ? 'Choose a class and section to use Auto.' : undefined}
            error={fieldErrors?.rollNo?.message}
            endAddon={
              <AutoFillButton
                purpose="fill the next roll number for this class and section"
                disabled={numbers.rollNo === null}
                onClick={() => fill('academic.rollNo', numbers.rollNo)}
              />
            }
            {...register('academic.rollNo')}
          />
          <Input
            label="Admission Date"
            type="date"
            error={fieldErrors?.admissionDate?.message}
            {...register('academic.admissionDate')}
          />
          <Controller
            control={control}
            name="academic.classGrade"
            render={({ field }) => (
              <Select
                label="Class"
                required
                placeholder={classes.isPending ? 'Loading classes…' : 'Select class'}
                options={classOptions}
                value={field.value}
                disabled={!classes.isSuccess}
                error={
                  classes.isError
                    ? 'Couldn’t load classes. Reload the page to try again.'
                    : fieldErrors?.classGrade?.message
                }
                onValueChange={(value) => {
                  field.onChange(value)
                  // Sections belong to a class, so a new class clears the old choice.
                  setValue('academic.section', '')
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="academic.section"
            render={({ field }) => (
              <Select
                label="Section"
                required
                placeholder={classGrade === '' ? 'Select a class first' : 'Select section'}
                options={sectionOptions}
                value={field.value}
                disabled={sectionOptions.length === 0}
                error={fieldErrors?.section?.message}
                onValueChange={field.onChange}
              />
            )}
          />
          <Input
            label="Biometric ID"
            autoComplete="off"
            placeholder="User ID on the attendance device"
            error={fieldErrors?.biometricId?.message}
            {...register('academic.biometricId')}
          />
        </div>
      </section>

      <section aria-labelledby="previous-school-heading" className="grid gap-4">
        <SectionHeading id="previous-school-heading" icon={BuildingsIcon} tone="muted">
          Previous school details
        </SectionHeading>
        <Textarea
          label="Previous School Name & Details"
          rows={3}
          placeholder="Previous school’s name, address and any other details"
          error={fieldErrors?.previousSchool?.message}
          {...register('academic.previousSchool')}
        />
        <Input
          label="Opening Due Balance (If Any)"
          inputMode="decimal"
          placeholder="e.g. 1500"
          hint="Fees still owed from before admission, in rupees. Saved as the student’s opening fee balance."
          error={fieldErrors?.openingDue?.message}
          {...register('academic.openingDue')}
        />
      </section>
    </div>
  )
}
