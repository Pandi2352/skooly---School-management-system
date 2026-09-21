import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/lib/api/ApiError'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { CUSTOM_FIELD_TYPE_OPTIONS } from '../constants'
import { useCreateCustomField, useUpdateCustomField } from '../hooks/useCustomFields'
import { customFieldFormSchema } from '../schemas/customField.schema'
import type { CustomField, CustomFieldFormValues } from '../types/customField.types'
import { isCustomFieldType, toFieldInput, toFormValues } from '../utils/customFields'

type CustomFieldFormProps = {
  /** The field being edited, or null to add a new one. */
  field: CustomField | null
  onDone: () => void
}

export function CustomFieldForm({ field, onDone }: CustomFieldFormProps) {
  const { toast } = useToast()
  const createField = useCreateCustomField()
  const updateField = useUpdateCustomField()
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CustomFieldFormValues>({
    resolver: zodResolver(customFieldFormSchema),
    defaultValues: toFormValues(field),
  })
  const type = useWatch({ control, name: 'type' })

  const submit = handleSubmit(async (values) => {
    const input = toFieldInput(values)
    try {
      const saved = field
        ? await updateField.mutateAsync({ id: field.id, input })
        : await createField.mutateAsync(input)
      toast.success(
        field ? 'Question updated' : 'Question added',
        saved.active
          ? `“${saved.label}” is asked on the admission form.`
          : `“${saved.label}” is saved but hidden, so the form doesn’t ask it yet.`,
      )
      onDone()
    } catch (error) {
      // The server checks the same things again; show its answer on the field it belongs to.
      if (error instanceof ApiError && error.errorCode === 'CUSTOM_FIELD_LABEL_TAKEN') {
        setError('label', { message: error.messages[0] }, { shouldFocus: true })
        return
      }
      if (error instanceof ApiError && error.errorCode === 'CUSTOM_FIELD_OPTIONS_REQUIRED') {
        setError('optionsText', { message: error.messages[0] }, { shouldFocus: true })
        return
      }
      toast.error('Couldn’t save the question', getErrorMessage(error))
    }
  })

  return (
    <form
      noValidate
      aria-label={field ? 'Edit question' : 'Add question'}
      onSubmit={(event) => void submit(event)}
    >
      <div className="grid gap-4">
        <Input
          label="Question"
          required
          autoComplete="off"
          placeholder="e.g. Birth marks"
          hint="What staff and parents read on the form. You can reword it later without losing past answers."
          error={errors.label?.message}
          {...register('label')}
        />
        <Controller
          control={control}
          name="type"
          render={({ field: typeField }) => (
            <Select
              label="Answer type"
              required
              options={CUSTOM_FIELD_TYPE_OPTIONS}
              value={typeField.value}
              onValueChange={(value) => {
                if (isCustomFieldType(value)) typeField.onChange(value)
              }}
            />
          )}
        />
        {type === 'select' && (
          <Textarea
            label="Choices"
            required
            rows={4}
            placeholder={'CBSE\nICSE\nState Board'}
            hint="One choice per line. At least two."
            error={errors.optionsText?.message}
            {...register('optionsText')}
          />
        )}
        {type !== 'checkbox' && (
          <Input
            label="Placeholder"
            autoComplete="off"
            placeholder={type === 'select' ? 'e.g. Select board' : 'e.g. Mole on the left hand'}
            hint="Grey example text shown inside the empty field."
            error={errors.placeholder?.message}
            {...register('placeholder')}
          />
        )}
        <Input
          label="Help text"
          autoComplete="off"
          placeholder="e.g. Used to identify the student"
          hint="A short note shown under the field."
          error={errors.helpText?.message}
          {...register('helpText')}
        />
        <div className="flex flex-wrap gap-x-6">
          <Controller
            control={control}
            name="required"
            render={({ field: requiredField }) => (
              <Checkbox
                label="Must be answered"
                checked={requiredField.value}
                onCheckedChange={(checked) => requiredField.onChange(checked === true)}
              />
            )}
          />
          <Controller
            control={control}
            name="active"
            render={({ field: activeField }) => (
              <Checkbox
                label="Show on the admission form"
                checked={activeField.value}
                onCheckedChange={(checked) => activeField.onChange(checked === true)}
              />
            )}
          />
        </div>
      </div>

      <div className="-mx-5 mt-5 -mb-5 flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">
        <Button variant="secondary" disabled={isSubmitting} onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {field ? 'Save changes' : 'Add question'}
        </Button>
      </div>
    </form>
  )
}
