import type { Icon } from '@phosphor-icons/react'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { FieldMessages } from './FieldMessages'
import { fieldDescribedBy, fieldLabelClasses } from './fieldStyles'

type InputProps = ComponentProps<'input'> & {
  label: string
  hideLabel?: boolean
  hint?: string
  error?: string
  /** Decorative icon inside the field, e.g. a magnifying glass for search. */
  startIcon?: Icon
  /** A control joined to the field's right edge, such as an "Auto" fill button. */
  endAddon?: ReactNode
}

export function Input({
  label,
  hideLabel = false,
  hint,
  error,
  startIcon: StartIcon,
  endAddon,
  id,
  className,
  ...props
}: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    // content-start: a grid item stretches to its row's height by default, so a neighbouring field
    // with a hint would push this one's label and control down, out of line across the row.
    <div className="grid content-start gap-1.5">
      <label htmlFor={inputId} className={fieldLabelClasses(hideLabel)}>
        {label}
        {props.required && (
          <span aria-hidden="true" className="ms-0.5 text-danger">
            *
          </span>
        )}
      </label>
      <div className={cn('relative', endAddon !== undefined && 'flex')}>
        {StartIcon && (
          <StartIcon
            className="pointer-events-none absolute start-3 top-1/2 size-4.5 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={fieldDescribedBy(inputId, hint, error)}
          className={cn(
            'h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-60 pointer-coarse:h-11',
            // Focus colours the field's own border, instead of the app-wide outline that sat 2px
            // outside and looked like a second border.
            'focus-visible:border-primary focus-visible:outline-none!',
            error ? 'border-danger focus-visible:border-danger' : 'border-field',
            StartIcon && 'ps-10',
            endAddon !== undefined && 'min-w-0 rounded-e-none',
            className,
          )}
          {...props}
        />
        {endAddon}
      </div>
      <FieldMessages id={inputId} hint={hint} error={error} />
    </div>
  )
}
