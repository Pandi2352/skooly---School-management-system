import { InfoIcon, WarningCircleIcon, WarningIcon, type Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type AlertTone = 'info' | 'warning' | 'danger'

const tones: Record<AlertTone, { container: string; icon: string; Icon: Icon }> = {
  info: { container: 'border-line bg-surface text-ink', icon: 'text-primary', Icon: InfoIcon },
  warning: {
    container: 'border-status bg-status text-status-ink',
    icon: 'text-status-ink',
    Icon: WarningIcon,
  },
  danger: {
    container: 'border-danger bg-surface text-ink',
    icon: 'text-danger',
    Icon: WarningCircleIcon,
  },
}

type AlertProps = {
  tone?: AlertTone
  /** What happened, in a few words. */
  title: string
  /** What it means or what to do. */
  children?: ReactNode
  action?: ReactNode
  className?: string
}

/** An inline message on the page. Danger alerts are announced to screen readers at once. */
export function Alert({ tone = 'info', title, children, action, className }: AlertProps) {
  const { container, icon, Icon: ToneIcon } = tones[tone]

  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex flex-wrap items-start gap-3 rounded-md border p-4', container, className)}
    >
      <ToneIcon weight="fill" className={cn('mt-0.5 size-5 flex-none', icon)} aria-hidden="true" />
      <div className="grid min-w-0 flex-1 gap-1">
        <p className="font-semibold">{title}</p>
        {children && <div className="text-sm">{children}</div>}
      </div>
      {action && <div className="flex-none">{action}</div>}
    </div>
  )
}
