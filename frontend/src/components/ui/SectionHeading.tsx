import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id: string
  icon: Icon
  children: ReactNode
  /** `primary`: a form's main section (h2). `muted`: a sub-section inside one (h3). */
  tone?: 'primary' | 'muted'
}

/** Heading bar for a form section, with a left accent (owner's reference). */
export function SectionHeading({
  id,
  icon: HeadingIcon,
  children,
  tone = 'primary',
}: SectionHeadingProps) {
  if (tone === 'muted') {
    return (
      <h3
        id={id}
        className="flex items-center gap-2.5 rounded-md border-s-4 border-control bg-canvas px-4 py-2 text-sm font-semibold text-ink"
      >
        <HeadingIcon className="size-5 flex-none text-ink-muted" weight="fill" aria-hidden="true" />
        {children}
      </h3>
    )
  }

  return (
    <h2
      id={id}
      className="flex items-center gap-2.5 rounded-md border-s-4 border-primary bg-table-head px-4 py-2.5 text-sm font-bold tracking-wide text-primary uppercase"
    >
      <HeadingIcon className="size-5 flex-none" weight="fill" aria-hidden="true" />
      {children}
    </h2>
  )
}
