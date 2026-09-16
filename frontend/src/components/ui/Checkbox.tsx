import { CheckIcon, MinusIcon } from '@phosphor-icons/react'
import { Checkbox as RadixCheckbox } from 'radix-ui'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CheckboxProps = Omit<ComponentProps<typeof RadixCheckbox.Root>, 'children'> & {
  label: ReactNode
  /** Keeps the label for screen readers only, e.g. row checkboxes in a table. */
  hideLabel?: boolean
  hint?: string
}

export function Checkbox({ label, hideLabel = false, hint, id, ...props }: CheckboxProps) {
  const autoId = useId()
  const checkboxId = id ?? autoId

  return (
    <div className={cn('flex items-center gap-3', hideLabel ? 'min-h-9' : 'min-h-11')}>
      <RadixCheckbox.Root
        id={checkboxId}
        aria-describedby={hint ? `${checkboxId}-hint` : undefined}
        className="group grid size-[1.125rem] flex-none cursor-pointer place-items-center rounded-[5px] border border-control bg-canvas text-surface shadow-[inset_0_1px_1px_rgb(0_0_0/0.05)] transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:shadow-none data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:shadow-none motion-reduce:transition-none"
        {...props}
      >
        <RadixCheckbox.Indicator>
          <CheckIcon
            className="size-3.5 group-data-[state=indeterminate]:hidden"
            weight="bold"
            aria-hidden="true"
          />
          <MinusIcon
            className="hidden size-3.5 group-data-[state=indeterminate]:block"
            weight="bold"
            aria-hidden="true"
          />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <div className={hideLabel ? 'sr-only' : 'grid'}>
        <label htmlFor={checkboxId} className="cursor-pointer text-sm leading-snug">
          {label}
        </label>
        {hint && (
          <p id={`${checkboxId}-hint`} className="text-sm text-ink-muted">
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}
