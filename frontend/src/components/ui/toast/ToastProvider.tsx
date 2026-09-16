import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  XIcon,
  type Icon,
} from '@phosphor-icons/react'
import { Toast } from 'radix-ui'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { IconButton } from '../IconButton'
import {
  ToastContext,
  type ToastAction,
  type ToastFunction,
  type ToastInput,
  type ToastTone,
} from './toastContext'

type ToastItem = ToastInput & { id: string }

type ToneVisual = {
  Icon: Icon
  containerClass: string
  accentBarClass: string
  badgeClass: string
  titleClass: string
  descClass: string
  progressClass: string
  closeBtnClass: string
  defaultDurationMs: number
}

const TONE_VISUALS: Record<ToastTone, ToneVisual> = {
  success: {
    Icon: CheckCircleIcon,
    containerClass: 'bg-[#ecfdf5] border-[#86efac] dark:bg-[#0f2a1c] dark:border-[#166534]',
    accentBarClass: 'bg-[#10b981]',
    badgeClass: 'bg-[#10b981] text-white shadow-xs',
    titleClass: 'text-[#065f46] dark:text-[#a7f3d0]',
    descClass: 'text-[#047857] dark:text-[#6ee7a0]',
    progressClass: 'bg-[#10b981]',
    closeBtnClass: 'text-[#047857] hover:text-[#065f46] hover:bg-[#10b981]/15 dark:text-[#a7f3d0] dark:hover:bg-[#10b981]/20',
    defaultDurationMs: 4000,
  },
  error: {
    Icon: WarningCircleIcon,
    containerClass: 'bg-[#fef2f2] border-[#fca5a5] dark:bg-[#3a1a18] dark:border-[#991b1b]',
    accentBarClass: 'bg-[#ef4444]',
    badgeClass: 'bg-[#ef4444] text-white shadow-xs',
    titleClass: 'text-[#991b1b] dark:text-[#fecaca]',
    descClass: 'text-[#b91c1c] dark:text-[#f87171]',
    progressClass: 'bg-[#ef4444]',
    closeBtnClass: 'text-[#b91c1c] hover:text-[#991b1b] hover:bg-[#ef4444]/15 dark:text-[#fecaca] dark:hover:bg-[#ef4444]/20',
    defaultDurationMs: 8000,
  },
  warning: {
    Icon: WarningIcon,
    containerClass: 'bg-[#fffbeb] border-[#fde68a] dark:bg-[#33270f] dark:border-[#b45309]',
    accentBarClass: 'bg-[#f59e0b]',
    badgeClass: 'bg-[#f59e0b] text-white shadow-xs',
    titleClass: 'text-[#92400e] dark:text-[#fde68a]',
    descClass: 'text-[#b45309] dark:text-[#fcd34d]',
    progressClass: 'bg-[#f59e0b]',
    closeBtnClass: 'text-[#b45309] hover:text-[#92400e] hover:bg-[#f59e0b]/15 dark:text-[#fde68a] dark:hover:bg-[#f59e0b]/20',
    defaultDurationMs: 6000,
  },
  info: {
    Icon: InfoIcon,
    containerClass: 'bg-[#f0f9ff] border-[#bae6fd] dark:bg-[#0c223d] dark:border-[#0369a1]',
    accentBarClass: 'bg-[#0ea5e9]',
    badgeClass: 'bg-[#0ea5e9] text-white shadow-xs',
    titleClass: 'text-[#0369a1] dark:text-[#bae6fd]',
    descClass: 'text-[#0284c7] dark:text-[#7dd3fc]',
    progressClass: 'bg-[#0ea5e9]',
    closeBtnClass: 'text-[#0284c7] hover:text-[#0369a1] hover:bg-[#0ea5e9]/15 dark:text-[#bae6fd] dark:hover:bg-[#0ea5e9]/20',
    defaultDurationMs: 4500,
  },
}

function createToastFunction(pushToast: (input: ToastInput) => void): ToastFunction {
  const fn = (input: ToastInput) => pushToast(input)
  return Object.assign(fn, {
    success: (title: string, description?: string, action?: ToastAction) =>
      pushToast({ title, description, tone: 'success', action }),
    error: (title: string, description?: string, action?: ToastAction) =>
      pushToast({ title, description, tone: 'error', action }),
    warning: (title: string, description?: string, action?: ToastAction) =>
      pushToast({ title, description, tone: 'warning', action }),
    info: (title: string, description?: string, action?: ToastAction) =>
      pushToast({ title, description, tone: 'info', action }),
  })
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const pushToast = useCallback((input: ToastInput) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { ...input, id }])
  }, [])

  const toastFn = useMemo(() => createToastFunction(pushToast), [pushToast])

  const contextValue = useMemo(() => ({ toast: toastFn }), [toastFn])

  return (
    <ToastContext value={contextValue}>
      <Toast.Provider swipeDirection="up" label="Notification">
        {children}
        {toasts.map((item) => {
          const tone: ToastTone = item.tone ?? 'info'
          const visual = TONE_VISUALS[tone]
          const ToneIcon = visual.Icon
          const duration = item.durationMs ?? visual.defaultDurationMs

          return (
            <Toast.Root
              key={item.id}
              duration={duration}
              type={tone === 'error' ? 'foreground' : 'background'}
              onOpenChange={(open) => {
                if (!open) setToasts((current) => current.filter((t) => t.id !== item.id))
              }}
              className={cn(
                'group pointer-events-auto relative flex w-auto max-w-[92vw] sm:max-w-xl items-center gap-2.5 overflow-hidden rounded-md border py-2 ps-2.5 pe-2 shadow-lg shadow-black/8 backdrop-blur-sm transition-all',
                'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-4 data-[state=open]:fade-in-0',
                visual.containerClass,
              )}
            >
              {/* Vibrant Tone Indicator Strip */}
              <span
                aria-hidden="true"
                className={cn('w-1 self-stretch shrink-0 -my-2 -ms-2.5 rounded-s-md', visual.accentBarClass)}
              />

              {/* Tone Icon Badge */}
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-md shadow-xs',
                  visual.badgeClass,
                )}
              >
                <ToneIcon weight="bold" className="size-3.5" aria-hidden="true" />
              </span>

              {/* Single-line Toast Content */}
              <div className="flex min-w-0 items-center gap-2">
                <Toast.Title className={cn('text-xs sm:text-sm font-bold whitespace-nowrap leading-none', visual.titleClass)}>
                  {item.title}
                </Toast.Title>
                {item.description && (
                  <>
                    <span className="text-xs opacity-40 select-none" aria-hidden="true">
                      •
                    </span>
                    <Toast.Description
                      className={cn('text-xs font-medium truncate max-w-[200px] sm:max-w-sm leading-none', visual.descClass)}
                    >
                      {item.description}
                    </Toast.Description>
                  </>
                )}
              </div>

              {/* Optional Action Button */}
              {item.action && (
                <button
                  type="button"
                  onClick={() => {
                    item.action?.onClick()
                    setToasts((current) => current.filter((t) => t.id !== item.id))
                  }}
                  className="shrink-0 cursor-pointer rounded-md border border-current/25 bg-white/70 dark:bg-black/25 px-2 py-0.5 text-xs font-semibold shadow-xs hover:bg-white dark:hover:bg-black/40 transition-colors"
                >
                  {item.action.label}
                </button>
              )}

              {/* Close Button */}
              <Toast.Close asChild>
                <IconButton
                  label="Dismiss"
                  icon={XIcon}
                  size="sm"
                  className={cn('-me-0.5 shrink-0 transition-colors', visual.closeBtnClass)}
                />
              </Toast.Close>

              {/* Auto-dismiss Countdown Progress Bar */}
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-black/5 dark:bg-white/10 overflow-hidden pointer-events-none">
                <div
                  className={cn(
                    'h-full animate-toast-countdown group-hover:[animation-play-state:paused]',
                    visual.progressClass,
                  )}
                  style={{ animationDuration: `${duration}ms` }}
                />
              </div>
            </Toast.Root>
          )
        })}
        <Toast.Viewport className="fixed top-4 inset-x-0 z-50 mx-auto flex w-full max-w-fit flex-col items-center gap-2 pointer-events-none px-4 outline-none" />
      </Toast.Provider>
    </ToastContext>
  )
}
