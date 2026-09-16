import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CardProps = Omit<ComponentProps<'section'>, 'title'> & {
  title?: string
  description?: string
  actions?: ReactNode
}

export function Card({ title, description, actions, className, children, ...props }: CardProps) {
  const headingId = useId()
  const hasHeader = Boolean(title) || Boolean(actions)

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn('rounded-md border border-line bg-surface', className)}
      {...props}
    >
      {hasHeader && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4">
          {title && (
            <div className="grid gap-0.5">
              <h2 id={headingId} className="text-base font-semibold">
                {title}
              </h2>
              {description && <p className="text-sm text-ink-muted">{description}</p>}
            </div>
          )}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn('px-5 pb-5', hasHeader ? 'pt-3' : 'pt-5')}>{children}</div>
    </section>
  )
}
