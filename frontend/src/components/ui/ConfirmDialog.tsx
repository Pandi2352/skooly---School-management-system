import { AlertDialog } from 'radix-ui'
import { useState, type ReactNode } from 'react'
import { Button } from './Button'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Name the thing affected: "Delete 3 students?" */
  title: string
  description: ReactNode
  confirmLabel: string
  cancelLabel?: string
  tone?: 'danger' | 'primary'
  onConfirm: () => void | Promise<void>
}

/** Cancel receives focus first, so Enter never triggers the risky action by accident. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false)

  const confirm = async () => {
    setPending(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!pending) onOpenChange(next)
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-backdrop" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 grid w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-3 rounded-md border border-line bg-surface p-5 text-ink shadow-xl">
          <AlertDialog.Title className="text-lg leading-tight font-semibold">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-ink-muted">
            {description}
          </AlertDialog.Description>
          <div className="mt-2 flex flex-wrap justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" disabled={pending}>
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <Button variant={tone} loading={pending} onClick={() => void confirm()}>
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
