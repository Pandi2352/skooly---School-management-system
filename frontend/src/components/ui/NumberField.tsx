import { useState, type ComponentProps } from 'react'
import { Input } from './Input'

type NumberFieldProps = Omit<
  ComponentProps<'input'>,
  'type' | 'value' | 'onChange' | 'min' | 'max'
> & {
  label: string
  hideLabel?: boolean
  hint?: string
  value: number
  min: number
  max: number
  onCommit: (value: number) => void
}

/**
 * A number input that applies its value on Enter or when focus leaves, so a half-typed number
 * never reaches the caller. Values outside min–max are clamped; Escape restores the current value.
 */
export function NumberField({
  value,
  min,
  max,
  onCommit,
  onBlur,
  onKeyDown,
  ...props
}: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null)

  const commit = () => {
    if (draft === null) return
    const number = Number(draft)
    if (draft.trim() !== '' && Number.isFinite(number))
      onCommit(Math.min(max, Math.max(min, number)))
    setDraft(null)
  }

  return (
    <Input
      type="number"
      inputMode="decimal"
      min={min}
      max={max}
      value={draft ?? String(value)}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={(event) => {
        commit()
        onBlur?.(event)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit()
        if (event.key === 'Escape') setDraft(null)
        onKeyDown?.(event)
      }}
      {...props}
    />
  )
}
