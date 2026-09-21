import { useId, type ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { FieldMessages } from './FieldMessages'
import { fieldDescribedBy, fieldLabelClasses } from './fieldStyles'

type TextareaProps = ComponentProps<'textarea'> & {
  label: string
  hideLabel?: boolean
  hint?: string
  error?: string
}

export function Textarea({
  label,
  hideLabel = false,
  hint,
  error,
  id,
  rows = 4,
  className,
  ...props
}: TextareaProps) {
  const autoId = useId()
  const textareaId = id ?? autoId

  return (
    // content-start: a grid item stretches to its row's height by default, so a neighbouring field
    // with a hint would push this one's label and control down, out of line across the row.
    <div className="grid content-start gap-1.5">
      <label htmlFor={textareaId} className={fieldLabelClasses(hideLabel)}>
        {label}
        {props.required && (
          <span aria-hidden="true" className="ms-0.5 text-danger">
            *
          </span>
        )}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={fieldDescribedBy(textareaId, hint, error)}
        className={cn(
          'w-full resize-y rounded-md border bg-surface px-3 py-2 text-sm leading-relaxed text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-60',
          // Same focus style as Input: coloured border, no outer outline.
          'focus-visible:border-primary focus-visible:outline-none!',
          error ? 'border-danger focus-visible:border-danger' : 'border-field',
          className,
        )}
        {...props}
      />
      <FieldMessages id={textareaId} hint={hint} error={error} />
    </div>
  )
}
