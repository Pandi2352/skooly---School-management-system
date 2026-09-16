import { Popover as RadixPopover } from 'radix-ui'
import type { ReactElement, ReactNode } from 'react'

type PopoverProps = {
  trigger: ReactElement
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/** Interactive floating content (filters, pickers). Use Tooltip for plain hints instead. */
export function Popover({
  trigger,
  children,
  side = 'bottom',
  align = 'start',
  open,
  onOpenChange,
}: PopoverProps) {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={16}
          className="z-50 w-72 max-w-[calc(100vw-2rem)] rounded-md border border-line bg-surface p-4 text-ink shadow-lg"
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
