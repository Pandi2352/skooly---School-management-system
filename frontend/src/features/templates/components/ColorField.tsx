import { useId } from 'react'
import { Checkbox } from '@/components/ui/Checkbox'

const HEX_COLOUR = /^#[0-9a-f]{6}$/i

type ColorFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  /** Adds a "None" option that sets the colour to transparent. */
  allowNone?: boolean
}

export function ColorField({ label, value, onChange, allowNone = false }: ColorFieldProps) {
  const id = useId()
  const isNone = value === 'transparent'

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-x-3">
        <input
          id={id}
          type="color"
          value={HEX_COLOUR.test(value) ? value : '#ffffff'}
          disabled={isNone}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-11 cursor-pointer rounded-md border border-field bg-surface p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="font-mono text-xs text-ink-muted">{isNone ? 'None' : value}</span>
        {allowNone && (
          <Checkbox
            label="None"
            checked={isNone}
            onCheckedChange={(checked) => onChange(checked === true ? 'transparent' : '#ffffff')}
          />
        )}
      </div>
    </div>
  )
}
