/* eslint-disable @typescript-eslint/no-deprecated */
import { useState } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  type SectorProps,
  Tooltip,
} from 'recharts'
import { Card } from '@/components/ui/Card'

type SourceSegment = {
  id: string
  label: string
  count: number
  color: string
}

const SOURCES: SourceSegment[] = [
  { id: 'walkin',   label: 'Walk-in & Reception',      count: 42, color: '#6366f1' },
  { id: 'portal',   label: 'Online Portal',             count: 34, color: '#0ea5e9' },
  { id: 'referral', label: 'Parent Referral',           count: 21, color: '#10b981' },
  { id: 'campaign', label: 'Education Fair',            count: 15, color: '#f59e0b' },
]

function PieTooltip(props: Record<string, unknown>) {
  const { active, payload } = props as {
    active?: boolean
    payload?: { name?: string; value?: number }[]
  }
  if (!active || !payload?.length) return null
  const item = payload[0]
  if (!item) return null
  const total = SOURCES.reduce((s, x) => s + x.count, 0)
  const pct = Math.round(((item.value ?? 0) / total) * 100)
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
      <p className="font-semibold text-ink">{item.name}</p>
      <p className="mt-0.5 tabular-nums text-ink-muted">
        <span className="text-base font-black text-ink">{item.value}</span> leads &bull; {pct}%
      </p>
    </div>
  )
}

// recharts active shape for inner text
function ActiveShape(props: SectorProps & { total?: number }) {
  const {
    cx = 0, cy = 0, innerRadius = 0, outerRadius = 0,
    startAngle, endAngle, payload, total,
  } = props as SectorProps & { payload?: { label: string; count: number }; total: number }
  const sectorFill = typeof props.fill === 'string' ? props.fill : '#6366f1'

  const count = payload?.count ?? 0
  const pct = Math.round((count / total) * 100)

  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="currentColor" className="fill-ink text-base font-black" style={{ fontSize: 22, fontWeight: 900 }}>
        {pct}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="currentColor" style={{ fontSize: 10, fill: '#9ca3af' }}>
        {payload?.label ?? ''}
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={(innerRadius) - 4}
        outerRadius={(outerRadius) + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={sectorFill}
        opacity={1}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={(outerRadius) + 10}
        outerRadius={(outerRadius) + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={sectorFill}
        opacity={0.35}
      />
    </g>
  )
}

function IdleShape(props: SectorProps) {
  return <Sector {...props} />
}

export function AdmissionSourceDonutChart() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const total = SOURCES.reduce((s, x) => s + x.count, 0)

  const data = SOURCES.map((s) => ({ ...s, name: s.label, value: s.count }))

  return (
    <Card
      title="Acquisition Channels & Leads"
      description="Where prospective families discover and apply to the school"
      className="min-w-0"
    >
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="48%"
            innerRadius={68}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            paddingAngle={3}
            activeIndex={activeIndex}
            activeShape={(props: SectorProps) => <ActiveShape {...props} total={total} />}
            inactiveShape={(props: SectorProps) => <IdleShape {...props} />}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
