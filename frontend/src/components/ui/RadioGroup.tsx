import { RadioGroup as RadixRadioGroup } from 'radix-ui'
import { useId } from 'react'
import { cn } from '@/lib/cn'
import { FieldMessages } from './FieldMessages'
import { fieldDescribedBy, fieldLabelClasses } from './fieldStyles'

export type RadioOption = {
  value: string
  label: string
  /** A line under the label, for choices that need explaining before they are picked. */
  description?: string
  disabled?: boolean
}

type RadioGroupProps = {
  label: string
  hideLabel?: boolean
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'vertical' | 'horizontal'
  hint?: string
  error?: string
  name?: string
  disabled?: boolean
  required?: boolean
}

/** Arrow keys move between options; the whole row, label included, is the tap target. */
export function RadioGroup({
  label,
  hideLabel = false,
  options,
  orientation = 'vertical',
  hint,
  error,
  ...rootProps
}: RadioGroupProps) {
  const id = useId()
  const labelId = `${id}-label`

  return (
    <div className="grid gap-1.5">
      <span id={labelId} className={fieldLabelClasses(hideLabel)}>
        {label}
      </span>
      <RadixRadioGroup.Root
        aria-labelledby={labelId}
        aria-describedby={fieldDescribedBy(id, hint, error)}
        aria-invalid={error ? true : undefined}
        orientation={orientation}
        className={cn(orientation === 'vertical' ? 'grid' : 'flex flex-wrap gap-x-6')}
        {...rootProps}
      >
        {options.map((option) => {
          const optionId = `${id}-${option.value}`
          return (
            <div
              key={option.value}
              className={cn('flex min-h-11 gap-3', option.description ? 'items-start py-2' : 'items-center')}
            >
              <RadixRadioGroup.Item
                id={optionId}
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  'grid size-5 flex-none cursor-pointer place-items-center rounded-full border bg-surface disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-primary',
                  option.description && 'mt-0.5',
                  error ? 'border-danger' : 'border-control',
                )}
              >
                <RadixRadioGroup.Indicator className="size-2.5 rounded-full bg-primary" />
              </RadixRadioGroup.Item>
              <label htmlFor={optionId} className="grid cursor-pointer gap-0.5 text-sm">
                <span>{option.label}</span>
                {option.description && <span className="text-ink-muted">{option.description}</span>}
              </label>
            </div>
          )
        })}
      </RadixRadioGroup.Root>
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  )
}
