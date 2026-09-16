import { Switch as RadixSwitch } from 'radix-ui'
import { useId } from 'react'
import { fieldLabelClasses } from './fieldStyles'

type SwitchProps = {
  label: string
  hint?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  name?: string
  /**
   * `row`: label left, switch right, for settings that apply at once.
   * `field`: bold label above and a Yes/No switch, to sit in a form grid beside inputs.
   * `field` needs `checked` so the Yes/No text stays in step.
   */
  variant?: 'row' | 'field'
}

const rootClasses =
  'inline-flex h-6 w-11 flex-none cursor-pointer items-center rounded-full border border-control bg-surface transition-colors disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-primary data-[state=checked]:bg-primary motion-reduce:transition-none'

const thumbClasses =
  'block size-4 translate-x-0.5 rounded-full bg-control transition-transform data-[state=checked]:translate-x-6 data-[state=checked]:bg-surface motion-reduce:transition-none'

export function Switch({ label, hint, variant = 'row', ...rootProps }: SwitchProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const control = (
    <RadixSwitch.Root id={id} aria-describedby={hintId} className={rootClasses} {...rootProps}>
      <RadixSwitch.Thumb className={thumbClasses} />
    </RadixSwitch.Root>
  )
  const hintText = hint && (
    <p id={hintId} className="text-sm text-ink-muted">
      {hint}
    </p>
  )

  if (variant === 'field') {
    return (
      <div className="grid content-start gap-1.5">
        <label htmlFor={id} className={fieldLabelClasses(false)}>
          {label}
        </label>
        <div className="flex h-10 items-center gap-2.5 pointer-coarse:h-11">
          {control}
          {/* The switch already announces its state; this is for sighted users. */}
          <span className="text-sm font-semibold text-ink-muted" aria-hidden="true">
            {rootProps.checked ? 'Yes' : 'No'}
          </span>
        </div>
        {hintText}
      </div>
    )
  }

  return (
    <div className="flex min-h-11 items-center justify-between gap-4">
      <div className="grid">
        <label htmlFor={id} className="cursor-pointer text-sm font-semibold text-ink">
          {label}
        </label>
        {hintText}
      </div>
      {control}
    </div>
  )
}
