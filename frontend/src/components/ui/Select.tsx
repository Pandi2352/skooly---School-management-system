import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { Select as RadixSelect } from 'radix-ui'
import { useId } from 'react'
import { cn } from '@/lib/cn'
import { FieldMessages } from './FieldMessages'
import { fieldDescribedBy, fieldLabelClasses } from './fieldStyles'

export type SelectOption = { value: string; label: string; disabled?: boolean }

type SelectProps = {
  label: string
  hideLabel?: boolean
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  name?: string
  /** `sm` matches small buttons in toolbars. */
  size?: 'md' | 'sm'
}

export function Select({
  label,
  hideLabel = false,
  options,
  placeholder,
  hint,
  error,
  size = 'md',
  ...rootProps
}: SelectProps) {
  const id = useId()

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className={fieldLabelClasses(hideLabel)}>
        {label}
        {rootProps.required && (
          <span aria-hidden="true" className="ms-0.5 text-danger">
            *
          </span>
        )}
      </label>
      <RadixSelect.Root {...rootProps}>
        <RadixSelect.Trigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={fieldDescribedBy(id, hint, error)}
          className={cn(
            'flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-surface text-start text-ink disabled:cursor-not-allowed disabled:opacity-60 data-placeholder:text-ink-muted pointer-coarse:h-11',
            size === 'md' ? 'h-10 px-3 text-sm' : 'h-8 px-2.5 text-[0.8125rem]',
            // Same focus style as Input: coloured border, no outer outline.
            'focus-visible:border-primary focus-visible:outline-none! data-[state=open]:border-primary',
            error ? 'border-danger focus-visible:border-danger' : 'border-field',
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <CaretDownIcon className="size-4 text-ink-muted" aria-hidden="true" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          {/* Shadow marks the list as floating above the page. */}
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-line bg-surface text-ink shadow-lg"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  // The filled highlight is the focus indicator, so the outline is replaced, not removed.
                  className="relative flex min-h-9 cursor-pointer items-center rounded-sm py-1.5 ps-8 pe-3 text-sm outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-primary data-highlighted:text-surface pointer-coarse:min-h-11"
                >
                  <RadixSelect.ItemIndicator className="absolute start-2">
                    <CheckIcon className="size-4" weight="bold" aria-hidden="true" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  )
}
