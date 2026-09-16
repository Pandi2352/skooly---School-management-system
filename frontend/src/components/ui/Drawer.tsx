import { XIcon } from '@phosphor-icons/react'
import { Dialog as RadixDialog } from 'radix-ui'
import type { ReactElement, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { IconButton } from './IconButton'

type DrawerProps = {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  trigger?: ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'start' | 'end'
}

/** A panel that slides over the page from one edge. Same focus and Escape behaviour as Dialog. */
export function Drawer({
  title,
  description,
  children,
  footer,
  trigger,
  open,
  onOpenChange,
  side = 'end',
}: DrawerProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-backdrop" />
        <RadixDialog.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            'fixed inset-y-0 z-50 grid w-[min(28rem,100vw)] grid-rows-[auto_1fr_auto] bg-surface text-ink shadow-xl',
            side === 'end' ? 'end-0 border-s border-line' : 'start-0 border-e border-line',
          )}
        >
          <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-3">
            <div className="grid gap-1 pt-2">
              <RadixDialog.Title className="text-lg leading-tight font-semibold">
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="text-ink-muted">
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close asChild>
              <IconButton label="Close" icon={XIcon} className="-me-2" />
            </RadixDialog.Close>
          </div>
          <div className="overflow-y-auto p-5">{children}</div>
          {footer && (
            <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
