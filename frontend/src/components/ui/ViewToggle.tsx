import type { Icon } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { iconButtonClasses } from './buttonStyles'
import { Tooltip } from './Tooltip'

export type ViewOption<T extends string> = { value: T; label: string; icon: Icon }

type ViewToggleProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: readonly ViewOption<T>[]
}

/** Icon buttons that switch a list between layouts, e.g. table and cards. */
export function ViewToggle<T extends string>({ value, onChange, options }: ViewToggleProps<T>) {
  return (
    <div
      role="group"
      aria-label="Layout"
      className="flex rounded-md border border-control p-0.5 print:hidden"
    >
      {options.map(({ value: option, label, icon: OptionIcon }) => (
        <Tooltip key={option} content={label}>
          <button
            type="button"
            aria-label={label}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={cn(
              iconButtonClasses({ size: 'sm' }),
              value === option && 'bg-primary text-surface hover:bg-primary hover:text-surface',
            )}
          >
            <OptionIcon className="size-4.5" aria-hidden="true" />
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
