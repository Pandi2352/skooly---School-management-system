import { XIcon } from '@phosphor-icons/react'
import { Dialog as RadixDialog } from 'radix-ui'
import type { ReactElement, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { IconButton } from './IconButton'

type DialogSize = 'sm' | 'md' | 'lg'

const sizes: Record<DialogSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-3xl',
}

type DialogProps = {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  /** Element that opens the dialog. Omit it when `open` is controlled from outside. */
  trigger?: ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  size?: DialogSize
}

/** Focus is trapped inside, Escape closes, and focus returns to the trigger. */
export function Dialog({
  title,
  description,
  children,
  footer,
  trigger,
  open,
  onOpenChange,
  size = 'md',
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-backdrop" />
        <RadixDialog.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            'fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_1fr_auto] rounded-md border border-line bg-surface text-ink shadow-xl',
            sizes[size],
          )}
        >
          <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
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
          <div className="overflow-y-auto px-5 pb-5">{children}</div>
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
