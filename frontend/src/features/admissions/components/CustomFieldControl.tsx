import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { CustomField } from '@/features/customFields'
import type { AdmissionFormValues } from '../types/admission.types'

/** One custom field as a form control, matching its type. */
export function CustomFieldControl({ field }: { field: CustomField }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const name = `documents.custom.${field.key}` as const
  const error = errors.documents?.custom?.[field.key]?.message
  const hint = field.helpText === '' ? undefined : field.helpText
  const placeholder = field.placeholder === '' ? undefined : field.placeholder

  switch (field.type) {
    case 'textarea':
      return (
        <div className="@xl:col-span-2">
          <Textarea
            label={field.label}
            required={field.required}
            rows={3}
            placeholder={placeholder}
            hint={hint}
            error={error}
            {...register(name)}
          />
        </div>
      )
    case 'select':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field: answer }) => (
            <Select
              label={field.label}
              required={field.required}
              placeholder={placeholder ?? 'Select'}
              options={field.options.map((option) => ({ value: option, label: option }))}
              value={typeof answer.value === 'string' ? answer.value : ''}
              onValueChange={answer.onChange}
              hint={hint}
              error={error}
            />
          )}
        />
      )
    case 'checkbox':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field: answer }) => (
            <div className="grid content-end">
              <Checkbox
                label={field.required ? `${field.label} (required)` : field.label}
                hint={hint}
                checked={answer.value === true}
                onCheckedChange={(checked) => answer.onChange(checked === true)}
              />
              {error && <p className="text-sm font-semibold text-danger">{error}</p>}
            </div>
          )}
        />
      )
    case 'number':
      return (
        <Input
          label={field.label}
          required={field.required}
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          hint={hint}
          error={error}
          {...register(name)}
        />
      )
    case 'date':
      return (
        <Input
          label={field.label}
          required={field.required}
          type="date"
          hint={hint}
          error={error}
          {...register(name)}
        />
      )
    case 'text':
      return (
        <Input
          label={field.label}
          required={field.required}
          autoComplete="off"
          placeholder={placeholder}
          hint={hint}
          error={error}
          {...register(name)}
        />
      )
  }
}
