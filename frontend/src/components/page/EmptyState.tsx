import { TrayIcon, type Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  /** Why it's empty. */
  description?: ReactNode
  /** The one action that fills it. */
  action?: ReactNode
  icon?: Icon
}

export function EmptyState({
  title,
  description,
  action,
  icon: StateIcon = TrayIcon,
}: EmptyStateProps) {
  return (
    <div className="grid justify-items-center gap-2 px-4 py-12 text-center">
      <StateIcon className="size-8 text-ink-muted" aria-hidden="true" />
      <p className="text-base font-semibold">{title}</p>
      {description && <p className="max-w-md text-ink-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
