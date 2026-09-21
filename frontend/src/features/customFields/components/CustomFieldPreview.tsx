import { EyeIcon } from '@phosphor-icons/react'
import { EmptyState } from '@/components/page/EmptyState'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { CustomField } from '../types/customField.types'

/**
 * The questions exactly as the admission form will show them, using the same controls the form
 * uses. It answers the question the settings table can't: "what will the office actually see?"
 *
 * Nothing here is interactive — it is a picture of the form, not a second copy of it.
 */
export function CustomFieldPreview({ fields }: { fields: CustomField[] }) {
  const shown = fields.filter((field) => field.active)

  return (
    <Card
      title="How the form will look"
      description="The Additional details section of Student Admission, in this order."
    >
      {shown.length === 0 ? (
        <EmptyState
          icon={EyeIcon}
          title="Nothing extra is asked yet"
          description="Questions you add and leave shown appear here, exactly as the admission form will present them."
        />
      ) : (
        // aria-hidden: a picture of the form. Screen readers read the real fields in the table
        // beside it, and duplicating them here would mean every question is announced twice.
        <div aria-hidden="true" className="grid gap-4">
          {shown.map((field) => (
            <PreviewControl key={field.id} field={field} />
          ))}
        </div>
      )}
    </Card>
  )
}

function PreviewControl({ field }: { field: CustomField }) {
  const shared = {
    label: field.label,
    hint: field.helpText || undefined,
    required: field.required,
    disabled: true,
  }

  if (field.type === 'checkbox') {
    return (
      <div className="grid gap-1">
        <Checkbox label={field.label} checked={false} disabled />
        {field.helpText && <p className="ms-7 text-sm text-ink-muted">{field.helpText}</p>}
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <Select
        {...shared}
        placeholder={field.placeholder || 'Choose one'}
        options={field.options.map((option) => ({ value: option, label: option }))}
      />
    )
  }

  if (field.type === 'textarea') {
    return <Textarea {...shared} placeholder={field.placeholder} rows={3} />
  }

  return (
    <Input
      {...shared}
      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
      placeholder={field.placeholder}
    />
  )
}
