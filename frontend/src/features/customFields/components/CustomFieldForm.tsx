import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/hooks/useToast'
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
      toast({
        title: field ? 'Field updated' : 'Field added',
        description: `“${saved.label}” is ${saved.active ? 'shown' : 'hidden'} on the admission form. Sample data: it resets when the page reloads.`,
      })
      onDone()
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t save the field',
        description: getErrorMessage(error),
      })
    }
  })

  return (
    <form
      noValidate
      aria-label={field ? 'Edit custom field' : 'Add custom field'}
      onSubmit={(event) => void submit(event)}
    >
      <div className="grid gap-4">
        <Input
          label="Label"
          required
          autoComplete="off"
          placeholder="e.g. Birth Marks"
          error={errors.label?.message}
          {...register('label')}
        />
        <Controller
          control={control}
          name="type"
          render={({ field: typeField }) => (
            <Select
              label="Field Type"
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
            label="Options"
            required
            rows={4}
            placeholder={'CBSE\nICSE\nState Board'}
            hint="One option per line."
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
          label="Help Text"
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
                label="Required"
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
          {field ? 'Save changes' : 'Add field'}
        </Button>
      </div>
    </form>
  )
}
