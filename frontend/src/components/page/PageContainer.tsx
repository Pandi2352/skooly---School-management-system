import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const APP_NAME = 'Skooly'

type PageContainerProps = {
  /** Used for the heading and the browser tab title. */
  title: string
  description?: ReactNode
  /** Small line above the title, such as a link to the parent module. */
  eyebrow?: ReactNode
  /** A status label under the title. */
  status?: ReactNode
  /** Buttons aligned to the right of the title; they wrap under it on phones. */
  actions?: ReactNode
  /** Lets wide tables use the whole content width. */
  fullWidth?: boolean
  children: ReactNode
}

export function PageContainer({
  title,
  description,
  eyebrow,
  status,
  actions,
  fullWidth = false,
  children,
}: PageContainerProps) {
  return (
    <div className={cn('w-full min-w-0', !fullWidth && 'max-w-6xl')}>
      <title>{`${title} · ${APP_NAME}`}</title>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        {/* Grows into the row: sized to its content it wrapped the description after half a line
            while the rest of the header sat empty. */}
        <div className="grid min-w-0 flex-1 basis-80 justify-items-start gap-1.5">
          {eyebrow}
          <h1 className="text-[clamp(1.375rem,1.2rem+0.5vw,1.625rem)] leading-tight font-bold tracking-tight wrap-anywhere text-ink">
            {title}
          </h1>
          {status}
          {/* Wide enough for a one-line summary, short enough that it never runs the full screen. */}
          {description && <p className="max-w-4xl text-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap justify-end gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  )
}
