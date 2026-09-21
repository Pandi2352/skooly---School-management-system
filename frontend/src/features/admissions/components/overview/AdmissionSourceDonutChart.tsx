import { useState } from 'react'
import { Card } from '@/components/ui/Card'

type SourceSegment = {
  id: string
  label: string
  count: number
  color: string
  bgClass: string
}

const SOURCES: SourceSegment[] = [
  { id: 'walkin', label: 'Walk-in & Reception', count: 42, color: '#1f3a5f', bgClass: 'bg-primary' },
  { id: 'portal', label: 'Online School Portal', count: 34, color: '#0060df', bgClass: 'bg-blue-600' },
  { id: 'referral', label: 'Sibling / Parent Referral', count: 21, color: '#0d9488', bgClass: 'bg-teal-600' },
  { id: 'campaign', label: 'Education Fair & Outreach', count: 15, color: '#f0a500', bgClass: 'bg-accent' },
]

function getComputedSegments(sources: SourceSegment[], total: number, circumference: number) {
  let runningPercent = 0
  return sources.map((segment) => {
    const share = segment.count / total
    const strokeDasharray = `${share * circumference} ${circumference}`
    const strokeDashoffset = -runningPercent * circumference
    runningPercent += share
    return {
      ...segment,
      share,
      strokeDasharray,
      strokeDashoffset,
    }
  })
}

export function AdmissionSourceDonutChart() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const total = SOURCES.reduce((sum, s) => sum + s.count, 0)

  // Calculate SVG donut stroke-dasharray & dashoffset
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const computedSegments = getComputedSegments(SOURCES, total, circumference)

  const activeSegment = hoveredId ? SOURCES.find((s) => s.id === hoveredId) : null

  return (
    <Card
      title="Acquisition Channels & Leads"
      description="Where prospective families discover and apply to the school"
      className="min-w-0"
    >
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        {/* SVG Donut */}
        <div className="relative flex size-44 flex-none items-center justify-center">
          <svg viewBox="0 0 160 160" className="size-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              className="text-canvas"
            />
            {/* Segments */}
            {computedSegments.map((segment) => {
              const isHovered = hoveredId === segment.id

              return (
                <circle
                  key={segment.id}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={isHovered ? 22 : 18}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredId(segment.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              )
            })}
          </svg>

          {/* Center Callout */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {activeSegment ? (
              <>
                <span className="text-xl font-bold tabular-nums text-ink">
                  {Math.round((activeSegment.count / total) * 100)}%
                </span>
                <span className="max-w-[70px] truncate text-[10px] font-medium text-ink-muted">
                  {activeSegment.label}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold tabular-nums text-ink">{total}</span>
                <span className="text-[11px] font-medium text-ink-muted">Total Leads</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="grid w-full gap-2.5 sm:max-w-xs">
          {SOURCES.map((segment) => {
            const pct = Math.round((segment.count / total) * 100)
            const isHovered = hoveredId === segment.id

            return (
              <div
                key={segment.id}
                onMouseEnter={() => setHoveredId(segment.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex cursor-pointer items-center justify-between rounded-md p-1.5 transition-colors ${
                  isHovered ? 'bg-canvas ring-1 ring-line' : 'hover:bg-canvas/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium text-ink">{segment.label}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="tabular-nums text-ink-muted">{segment.count} leads</span>
                  <span className="font-bold tabular-nums text-ink">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
