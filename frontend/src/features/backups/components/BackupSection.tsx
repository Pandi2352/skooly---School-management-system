import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type BackupSectionProps = {
  id: string
  icon: Icon
  title: string
  actions?: ReactNode
  children: ReactNode
}

/** A bordered panel with a titled header bar, as in the owner's reference. */
export function BackupSection({
  id,
  icon: SectionIcon,
  title,
  actions,
  children,
}: BackupSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="min-w-0 overflow-hidden rounded-md border border-line bg-surface"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id={id} className="flex items-center gap-2 text-base font-bold text-ink">
          <SectionIcon className="size-5 text-primary" weight="fill" aria-hidden="true" />
          {title}
        </h2>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      {children}
    </section>
  )
}
