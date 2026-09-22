import type { Icon } from '@phosphor-icons/react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type RecordsCardProps = {
  /** Names what the rows are: "Student records", "Staff accounts". */
  title: string
  icon?: Icon
  /** Counts or labels beside the title. */
  badges?: ReactNode
  /** Controls at the far end of the title row, such as a list/grid toggle. */
  headerEnd?: ReactNode
  /** Search and filters. The card supplies the row, so each toolbar only provides its controls. */
  toolbar?: ReactNode
  /** Pagination, in a bordered footer. Left out when there is only one page. */
  footer?: ReactNode
  /** The table or grid. It should be borderless: this card is the border. */
  children: ReactNode
  className?: string
}

/**
 * The shell every list page uses: a title row, a filter row, the rows themselves and a footer, all
 * inside one bordered card.
 *
 * It exists so the spacing is decided once. Pages that built their own ended up with a card inside a
 * card and doubled padding, which is what this replaces. Controls sit on a surface card because
 * their borders don't reach 3:1 contrast against the page background.
 *
 * The title and the toolbar share one block with a single rule under it: a line between them read
 * as two separate bars and made the card the loudest thing on the page.
 */
export function RecordsCard({
  title,
  icon: TitleIcon,
  badges,
  headerEnd,
  toolbar,
  footer,
  children,
  className,
}: RecordsCardProps) {
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className={cn('min-w-0 rounded-md border border-line bg-surface', className)}
    >
      <div className="grid gap-3 border-b border-line px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <h2 id={headingId} className="flex items-center gap-2 text-base font-semibold text-ink">
              {TitleIcon && <TitleIcon className="size-5 flex-none text-primary" aria-hidden="true" />}
              {title}
            </h2>
            {badges}
          </div>
          {headerEnd}
        </div>

        {/*
          One wrapping row, packed from the start edge. Pushing search to the far end left a lane of
          empty card between the filters and the box; a toolbar that wants the far end asks for it
          with ms-auto.
        */}
        {toolbar && (
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2 print:hidden">{toolbar}</div>
        )}
      </div>

      {children}

      {footer && <div className="border-t border-line px-4 py-2.5">{footer}</div>}
    </section>
  )
}
