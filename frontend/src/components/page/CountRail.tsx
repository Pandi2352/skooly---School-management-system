import type { Icon } from '@phosphor-icons/react'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'

/** State colours from DESIGN.md. Each one sits beside its own label, so colour never carries alone. */
export type CountTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

const tones: Record<CountTone, { edge: string; chip: string; bars: string }> = {
  neutral: { edge: 'border-t-control', chip: 'bg-canvas text-ink-muted', bars: 'text-control' },
  primary: { edge: 'border-t-primary', chip: 'bg-primary/10 text-primary', bars: 'text-primary' },
  success: { edge: 'border-t-success', chip: 'bg-success-soft text-success', bars: 'text-success' },
  warning: { edge: 'border-t-status-ink', chip: 'bg-status text-status-ink', bars: 'text-status-ink' },
  danger: { edge: 'border-t-danger', chip: 'bg-danger-soft text-danger', bars: 'text-danger' },
}

/** Fixed bar heights. Identical in every segment on purpose: see BarMark. */
const BAR_HEIGHTS = [7, 12, 9, 16, 11, 19, 14]

/**
 * A bar-chart mark at the end of a segment, in its state colour (owner's reference, 2026-09-22).
 *
 * The same seven bars in every segment, never drawn from the count beside them. A mark that changed
 * per card would be read as that card's history, and there is no daily series behind these figures
 * to draw one from. Identical everywhere, it reads as what it is: an icon.
 */
function BarMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 27 20"
      aria-hidden="true"
      className={cn('h-7 w-9 flex-none', className)}
    >
      {BAR_HEIGHTS.map((height, index) => (
        <rect
          key={index}
          x={index * 4}
          y={20 - height}
          width="2.5"
          height={height}
          rx="1"
          fill="currentColor"
          fillOpacity={index % 2 === 0 ? 0.35 : 0.7}
        />
      ))}
    </svg>
  )
}

export type CountSegment = {
  id: string
  label: string
  count: number
  /** Names what the count is. Generic glyphs don't belong here: pick one that says the state. */
  icon: Icon
  /** The state colour. Left out, the figure is a plain one. */
  tone?: CountTone
  /** What the count means, shown on hover and focus. */
  hint?: string
  /** Keeps a zero out of the rail unless it is one of the few that always matter. */
  hideWhenZero?: boolean
}

type CountRailProps = {
  /** Read by screen readers: "Application totals", "Account totals". */
  label: string
  segments: CountSegment[]
  /** Makes each segment filter the list below. Left out, they are plain figures. */
  onSelect?: (id: string) => void
  /** The segment currently filtering; choosing it again clears the filter. */
  activeId?: string
  className?: string
}

const segmentClasses =
  'flex h-full w-full items-center gap-3 border-t-2 px-3 py-2.5 text-start focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary'

/**
 * The shape of a list in one strip: how many rows there are, and how they split across the states
 * that matter. Each segment wears its state's colour on the top edge and on its icon, so the split
 * is readable before a single figure is. Where the counts filter, the segment in force is filled in
 * and pressed.
 *
 * A rail rather than a row of loose pills: five pills read as confetti above the list they belong
 * to, and a row of big stat cards pushes the rows themselves below the fold.
 */
export function CountRail({ label, segments, onSelect, activeId, className }: CountRailProps) {
  const visible = segments.filter((segment) => !segment.hideWhenZero || segment.count > 0)
  if (visible.length === 0) return null

  return (
    <ul
      aria-label={label}
      className={cn(
        'flex flex-wrap overflow-hidden rounded-md border border-line bg-surface',
        // Each segment keeps a readable width and shares the rest, so three or eight both hold up.
        '[&>li]:min-w-44 [&>li]:flex-1 [&>li+li]:border-s [&>li+li]:border-line',
        className,
      )}
    >
      {visible.map((segment) => {
        const { icon: SegmentIcon, tone = 'neutral' } = segment
        const isActive = activeId === segment.id
        const { edge, chip, bars } = tones[tone]

        const body = (
          <>
            <span className={cn('grid size-9 flex-none place-items-center rounded-md', chip)}>
              <SegmentIcon className="size-5" weight="fill" aria-hidden="true" />
            </span>
            <span className="grid min-w-0 gap-0.5">
              <span className="text-lg leading-tight font-semibold tabular-nums text-ink">
                {formatNumber(segment.count)}
              </span>
              <span className={cn('truncate text-[0.8125rem]', isActive ? 'text-ink' : 'text-ink-muted')}>
                {segment.label}
              </span>
            </span>
            <BarMark className={cn('ms-auto', bars)} />
          </>
        )

        const content = onSelect ? (
          <button
            type="button"
            aria-pressed={isActive}
            // Choosing the segment already filtering clears it, so the rail is a set of toggles.
            onClick={() => onSelect(isActive ? 'all' : segment.id)}
            className={cn(
              segmentClasses,
              edge,
              'cursor-pointer hover:bg-canvas',
              isActive && 'bg-canvas',
            )}
          >
            {body}
          </button>
        ) : (
          // Focusable only when there is a hint to reach, so a plain figure stays out of the tab order.
          <div tabIndex={segment.hint ? 0 : undefined} className={cn(segmentClasses, edge)}>
            {body}
          </div>
        )

        return (
          <li key={segment.id}>
            {segment.hint ? <Tooltip content={segment.hint}>{content}</Tooltip> : content}
          </li>
        )
      })}
    </ul>
  )
}
