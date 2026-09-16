import { CheckIcon, type Icon } from '@phosphor-icons/react'
import { DropdownMenu } from 'radix-ui'
import type { ReactElement, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type DropdownProps = {
  trigger: ReactElement
  children: ReactNode
  align?: 'start' | 'center' | 'end'
}

/** Arrow keys move between items, typing jumps to an item, Escape closes. */
export function Dropdown({ trigger, children, align = 'end' }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={6}
          className="z-50 min-w-48 rounded-md border border-line bg-surface p-1 text-ink shadow-lg"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

type DropdownItemProps = {
  children: ReactNode
  icon?: Icon
  onSelect?: () => void
  tone?: 'default' | 'danger'
  disabled?: boolean
}

export function DropdownItem({
  children,
  icon: ItemIcon,
  onSelect,
  tone = 'default',
  disabled,
}: DropdownItemProps) {
  return (
    <DropdownMenu.Item
      disabled={disabled}
      onSelect={onSelect}
      // The filled highlight is the focus indicator, so the outline is replaced, not removed.
      className={cn(
        'flex min-h-9 cursor-pointer items-center gap-2.5 rounded-sm px-3 py-1.5 text-sm text-ink outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-primary data-highlighted:text-surface pointer-coarse:min-h-11',
        tone === 'danger' && 'text-danger data-highlighted:bg-danger',
      )}
    >
      {ItemIcon && <ItemIcon className="size-4.5 flex-none" aria-hidden="true" />}
      {children}
    </DropdownMenu.Item>
  )
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu.Label className="px-3 pt-2 pb-1 text-sm text-ink-muted">
      {children}
    </DropdownMenu.Label>
  )
}

type DropdownCheckboxItemProps = {
  children: ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

/** A toggle inside a menu. The menu stays open so several items can be changed in a row. */
export function DropdownCheckboxItem({
  children,
  checked,
  onCheckedChange,
  disabled,
}: DropdownCheckboxItemProps) {
  return (
    <DropdownMenu.CheckboxItem
      checked={checked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      onSelect={(event) => {
        event.preventDefault()
      }}
      className="relative flex min-h-9 cursor-pointer items-center rounded-sm py-1.5 ps-9 pe-3 text-sm text-ink outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-primary data-highlighted:text-surface pointer-coarse:min-h-11"
    >
      <DropdownMenu.ItemIndicator className="absolute start-3">
        <CheckIcon className="size-4" weight="bold" aria-hidden="true" />
      </DropdownMenu.ItemIndicator>
      {children}
    </DropdownMenu.CheckboxItem>
  )
}

type DropdownRadioGroupProps = {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
}

/** One choice out of several, e.g. a colour theme. */
export function DropdownRadioGroup({ value, onValueChange, children }: DropdownRadioGroupProps) {
  return (
    <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange}>
      {children}
    </DropdownMenu.RadioGroup>
  )
}

export function DropdownRadioItem({ value, children }: { value: string; children: ReactNode }) {
  return (
    <DropdownMenu.RadioItem
      value={value}
      // Stays open so the change can be seen before closing.
      onSelect={(event) => {
        event.preventDefault()
      }}
      className="relative flex min-h-9 cursor-pointer items-center gap-2.5 rounded-sm py-1.5 ps-9 pe-3 text-sm text-ink outline-none data-highlighted:bg-primary data-highlighted:text-surface pointer-coarse:min-h-11"
    >
      <DropdownMenu.ItemIndicator className="absolute start-3">
        <CheckIcon className="size-4" weight="bold" aria-hidden="true" />
      </DropdownMenu.ItemIndicator>
      {children}
    </DropdownMenu.RadioItem>
  )
}

export function DropdownSeparator() {
  return <DropdownMenu.Separator className="my-1 h-px bg-line" />
}
