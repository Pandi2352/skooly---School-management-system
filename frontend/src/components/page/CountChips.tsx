import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Tooltip } from '@/components/ui/Tooltip'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'

export type CountChip = {
  id: string
  label: string
  count: number
  /** What the count means, shown on hover and focus. */
  hint?: string
  tone?: BadgeTone
  /** Keeps a zero out of the row unless it is one of the few that always matter. */
  hideWhenZero?: boolean
}

type CountChipsProps = {
  /** Read by screen readers: "Student totals", "Account totals". */
  label: string
  chips: CountChip[]
  /** Makes the chips filter the list. Left out, they are plain labels. */
  onSelect?: (id: string) => void
  /** The chip currently filtering; clicking it again clears the filter. */
  activeId?: string
  className?: string
}

/**
 * Counts under a page title, in the same small chips the student list uses. Big cards were tried
 * first and pushed the actual rows below the fold — these say the same thing in one line.
 *
 * With `onSelect` each chip filters the list, and the pressed one shows which filter is on.
 */
export function CountChips({ label, chips, onSelect, activeId, className }: CountChipsProps) {
  const visible = chips.filter((chip) => !chip.hideWhenZero || chip.count > 0)
  if (visible.length === 0) return null

  return (
    <ul aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {visible.map((chip) => {
        const text = `${formatNumber(chip.count)} ${chip.label}`
        const badge = (
          <Badge tone={chip.tone ?? 'neutral'} className={cn(activeId === chip.id && 'ring-1 ring-primary')}>
            {text}
          </Badge>
        )

        return (
          <li key={chip.id}>
            {onSelect ? (
              <Tooltip content={chip.hint ?? `Show only ${chip.label.toLowerCase()}`}>
                <button
                  type="button"
                  aria-pressed={activeId === chip.id}
                  // Clicking the chip that is already filtering clears it, so the row is a toggle.
                  onClick={() => onSelect(activeId === chip.id ? 'all' : chip.id)}
                  className="cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  {badge}
                </button>
              </Tooltip>
            ) : chip.hint ? (
              <Tooltip content={chip.hint}>{badge}</Tooltip>
            ) : (
              badge
            )}
          </li>
        )
      })}
    </ul>
  )
}
