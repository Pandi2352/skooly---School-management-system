import { useId, useState } from 'react'
import { Card } from '@/components/ui/Card'
import type { AdmissionDayCount } from '../../schemas/admissionPipeline.schema'

type ApplicationTrendChartProps = {
  days: AdmissionDayCount[]
  windowDays: number
}

const VIEW_WIDTH = 720
const VIEW_HEIGHT = 200
const PADDING = { top: 16, right: 16, bottom: 26, left: 32 }

const shortDate = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

export function ApplicationTrendChart({ days, windowDays: initialWindowDays }: ApplicationTrendChartProps) {
  const titleId = useId()
  const gradientId = useId()
  const [hovered, setHovered] = useState<number | null>(null)
  const [selectedRange, setSelectedRange] = useState<number>(initialWindowDays || 30)

  const activeDays = days.slice(-selectedRange)

  const plotWidth = VIEW_WIDTH - PADDING.left - PADDING.right
  const plotHeight = VIEW_HEIGHT - PADDING.top - PADDING.bottom
  const highest = Math.max(1, ...activeDays.map((entry) => entry.count))
  const step = activeDays.length > 1 ? plotWidth / (activeDays.length - 1) : plotWidth

  const pointAt = (index: number, count: number) => ({
    x: PADDING.left + index * step,
    y: PADDING.top + plotHeight - (count / highest) * plotHeight,
  })

  const points = activeDays.map((entry, index) => pointAt(index, entry.count))

  // Build a smooth cubic bezier curve for a state-of-the-art look
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return ''
    if (pts.length === 1) return `M ${pts[0]?.x ?? 0} ${pts[0]?.y ?? 0}`

    let d = `M ${pts[0]?.x ?? 0} ${pts[0]?.y ?? 0}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i]
      const p1 = pts[i + 1]
      if (!p0 || !p1) continue
      const cx = (p0.x + p1.x) / 2
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`
    }
    return d
  }

  const line = buildSmoothPath(points)
  const lastPoint = points.at(-1)
  const firstPoint = points[0]
  const area = `${line} L ${lastPoint?.x ?? PADDING.left + plotWidth} ${PADDING.top + plotHeight} L ${firstPoint?.x ?? PADDING.left} ${PADDING.top + plotHeight} Z`
  const total = activeDays.reduce((sum, entry) => sum + entry.count, 0)
  const active = hovered === null ? null : activeDays[hovered]

  return (
    <Card
      title="Application Intake Velocity"
      description={`${total} applications received in the active window`}
      className="min-w-0"
      actions={
        <div className="flex items-center gap-1 rounded-md border border-line bg-canvas p-0.5">
          {[7, 14, 30].map((daysCount) => (
            <button
              key={daysCount}
              type="button"
              onClick={() => setSelectedRange(daysCount)}
              className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors ${
                selectedRange === daysCount
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {daysCount}D
            </button>
          ))}
        </div>
      }
    >
      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-52 w-full"
          role="img"
          aria-label={`Applications received each day over the last ${selectedRange} days, ${total} in total.`}
          aria-labelledby={titleId}
          preserveAspectRatio="none"
        >
          <title id={titleId}>
            Applications received each day over the last {selectedRange} days, {total} in total.
          </title>

          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0060df" stopOpacity="0.38" />
              <stop offset="60%" stopColor="#0060df" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0060df" stopOpacity="0.00" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0060df" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Recessed Gridlines */}
          {[0, 0.33, 0.66, 1].map((fraction) => (
            <line
              key={fraction}
              x1={PADDING.left}
              x2={PADDING.left + plotWidth}
              y1={PADDING.top + plotHeight * fraction}
              y2={PADDING.top + plotHeight * fraction}
              className="stroke-line/60"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}

          {/* Area Fill */}
          <path d={area} fill={`url(#${gradientId})`} />

          {/* Smooth Curved Line */}
          <path
            d={line}
            fill="none"
            stroke="#0060df"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Active Hover Crosshair & Node */}
          {active && hovered !== null && points[hovered] && (
            <g>
              <line
                x1={points[hovered].x}
                x2={points[hovered].x}
                y1={PADDING.top}
                y2={PADDING.top + plotHeight}
                stroke="#0060df"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
              <circle
                cx={points[hovered].x}
                cy={points[hovered].y}
                r={6}
                fill="#0060df"
                stroke="#ffffff"
                strokeWidth={2.5}
                className="transition-all duration-150"
              />
            </g>
          )}

          {/* Hit areas for crisp mouse interaction */}
          {activeDays.map((entry, index) => (
            <rect
              key={entry.day}
              x={pointAt(index, 0).x - step / 2}
              y={PADDING.top}
              width={Math.max(step, 8)}
              height={plotHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>

        {/* Date axis ends */}
        <div className="mt-1 flex justify-between text-xs text-ink-muted">
          <span>{activeDays[0] ? shortDate(activeDays[0].day) : ''}</span>
          <span className="text-[11px] font-medium text-ink-muted">Daily Velocity Trend</span>
          <span>{activeDays.at(-1) ? shortDate(activeDays[activeDays.length - 1]?.day ?? '') : ''}</span>
        </div>

        {/* Floating Tooltip */}
        {active && (
          <div
            role="status"
            className="pointer-events-none absolute top-1 right-2 rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-md backdrop-blur-xs ring-1 ring-black/5"
          >
            <div className="text-[11px] font-medium text-ink-muted">{shortDate(active.day)}</div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-lg font-bold tabular-nums text-ink">{active.count}</span>
              <span className="text-ink-muted">applications</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
