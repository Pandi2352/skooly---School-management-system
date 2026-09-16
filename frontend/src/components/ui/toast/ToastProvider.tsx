import { InfoIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react'
import { Toast } from 'radix-ui'
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { IconButton } from '../IconButton'
import { ToastContext, type ToastInput } from './toastContext'

type ToastItem = ToastInput & { id: number }

const INFO_DURATION_MS = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const toast = useCallback((input: ToastInput) => {
    nextId.current += 1
    const id = nextId.current
    setToasts((current) => [...current, { ...input, id }])
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext value={value}>
      <Toast.Provider swipeDirection="right" label="Notification">
        {children}
        {toasts.map((item) => {
          const isError = item.tone === 'error'
          const ToneIcon = isError ? WarningCircleIcon : InfoIcon
          return (
            <Toast.Root
              key={item.id}
              // Errors stay until dismissed so they can't be missed.
              duration={isError ? Infinity : INFO_DURATION_MS}
              type={isError ? 'foreground' : 'background'}
              onOpenChange={(open) => {
                if (!open) setToasts((current) => current.filter((t) => t.id !== item.id))
              }}
              className="grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-md border border-line bg-surface p-4 text-ink shadow-lg"
            >
              <ToneIcon
                weight="fill"
                className={cn('mt-0.5 size-5', isError ? 'text-danger' : 'text-primary')}
                aria-hidden="true"
              />
              <div className="grid gap-0.5">
                <Toast.Title className="font-semibold">{item.title}</Toast.Title>
                {item.description && (
                  <Toast.Description className="text-sm text-ink-muted">
                    {item.description}
                  </Toast.Description>
                )}
              </div>
              <Toast.Close asChild>
                <IconButton label="Dismiss" icon={XIcon} size="sm" className="-me-2 -mt-2" />
              </Toast.Close>
            </Toast.Root>
          )
        })}
        <Toast.Viewport className="fixed end-0 bottom-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4" />
      </Toast.Provider>
    </ToastContext>
  )
}
