import { useId, useState } from 'react'
import { Card } from '@/components/ui/Card'
import type { AdmissionDayCount } from '../../schemas/admissionPipeline.schema'

type ApplicationTrendChartProps = {
  days: AdmissionDayCount[]
  windowDays: number
}

const VIEW_WIDTH = 720
const VIEW_HEIGHT = 200
const PADDING = { top: 12, right: 12, bottom: 24, left: 32 }

const shortDate = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

/**
 * Applications per day. One series, so no legend: the title names it, and the only colour is the
 * line itself. Quiet days are real days — the API sends zeroes rather than gaps, so the line never
 * joins two busy days and invents a week that didn't happen.
 */
export function ApplicationTrendChart({ days, windowDays }: ApplicationTrendChartProps) {
  const titleId = useId()
  const [hovered, setHovered] = useState<number | null>(null)

  const plotWidth = VIEW_WIDTH - PADDING.left - PADDING.right
  const plotHeight = VIEW_HEIGHT - PADDING.top - PADDING.bottom
  const highest = Math.max(1, ...days.map((entry) => entry.count))
  const step = days.length > 1 ? plotWidth / (days.length - 1) : plotWidth

  const pointAt = (index: number, count: number) => ({
    x: PADDING.left + index * step,
    y: PADDING.top + plotHeight - (count / highest) * plotHeight,
  })

  const points = days.map((entry, index) => pointAt(index, entry.count))
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')
  const area = `${line} L${PADDING.left + plotWidth} ${PADDING.top + plotHeight} L${PADDING.left} ${PADDING.top + plotHeight} Z`
  const total = days.reduce((sum, entry) => sum + entry.count, 0)
  const active = hovered === null ? null : days[hovered]

  return (
    <Card
      title="Applications received"
      description={`${total} in the last ${windowDays} days`}
      className="min-w-0"
    >
      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-48 w-full"
          role="img"
          aria-labelledby={titleId}
          preserveAspectRatio="none"
        >
          <title id={titleId}>
            Applications received each day over the last {windowDays} days, {total} in total.
          </title>

          {/* Grid: recessive, three lines. Any more competes with the data. */}
          {[0, 0.5, 1].map((fraction) => (
            <line
              key={fraction}
              x1={PADDING.left}
              x2={PADDING.left + plotWidth}
              y1={PADDING.top + plotHeight * fraction}
              y2={PADDING.top + plotHeight * fraction}
              className="stroke-line"
              strokeWidth={1}
            />
          ))}

          <path d={area} className="fill-primary/10" />
          <path
            d={line}
            fill="none"
            className="stroke-primary"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {active && hovered !== null && (
            <g>
              <line
                x1={points[hovered]?.x}
                x2={points[hovered]?.x}
                y1={PADDING.top}
                y2={PADDING.top + plotHeight}
                className="stroke-ink-muted"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              {/* A surface ring keeps the marker readable wherever it lands on the area fill. */}
              <circle
                cx={points[hovered]?.x}
                cy={points[hovered]?.y}
                r={4}
                className="fill-primary stroke-surface"
                strokeWidth={2}
              />
            </g>
          )}

          {/* Hit areas are wider than the marks, so a day is easy to point at. */}
          {days.map((entry, index) => (
            <rect
              key={entry.day}
              x={pointAt(index, 0).x - step / 2}
              y={PADDING.top}
              width={Math.max(step, 8)}
              height={plotHeight}
              fill="transparent"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>

        {/* The axis ends only: a label under every day would be unreadable at this width. */}
        <div className="mt-1 flex justify-between text-xs text-ink-muted">
          <span>{days[0] ? shortDate(days[0].day) : ''}</span>
          <span>{days.at(-1) ? shortDate(days[days.length - 1]?.day ?? '') : ''}</span>
        </div>

        {active && (
          <p
            role="status"
            className="pointer-events-none absolute top-0 right-0 rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm shadow-lg"
          >
            <span className="font-semibold text-ink">{active.count}</span>
            <span className="text-ink-muted"> on {shortDate(active.day)}</span>
          </p>
        )}
      </div>
    </Card>
  )
}
