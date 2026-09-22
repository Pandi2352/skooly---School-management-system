import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { Input } from './Input'

type SearchInputProps = Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange' | 'size'> & {
  /** Read by screen readers; the field shows only the icon and placeholder. */
  label: string
  /** `sm` matches the small Select, so a filter row lines up on one height. */
  size?: 'md' | 'sm'
  value: string
  onValueChange: (value: string) => void
}

/**
 * The search field every list uses: magnifying-glass icon, hidden label, native clear button.
 * It fills its container, so the caller sets the width.
 */
export function SearchInput({
  label,
  value,
  onValueChange,
  placeholder = 'Search…',
  ...props
}: SearchInputProps) {
  return (
    <Input
      type="search"
      label={label}
      hideLabel
      startIcon={MagnifyingGlassIcon}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      autoComplete="off"
      {...props}
    />
  )
}
