import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import type { AdmissionDayCount } from '../../schemas/admissionPipeline.schema'

type ApplicationTrendChartProps = {
  days: AdmissionDayCount[]
  windowDays: number
}

const shortDate = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

function CustomTooltip(props: Record<string, unknown>) {
  const { active, payload, label } = props as {
    active?: boolean
    payload?: { value?: number }[]
    label?: string
  }
  if (!active || !payload?.length) return null
  const count = payload[0]?.value ?? 0
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm ring-1 ring-black/5">
      <p className="font-medium text-ink-muted">{label}</p>
      <p className="mt-0.5 text-lg font-black tabular-nums text-ink">
        {count} <span className="text-xs font-normal text-ink-muted">applications</span>
      </p>
    </div>
  )
}

export function ApplicationTrendChart({ days, windowDays: initialWindowDays }: ApplicationTrendChartProps) {
  const [selectedRange, setSelectedRange] = useState<number>(initialWindowDays || 30)

  const activeDays = days.slice(-selectedRange).map((d) => ({
    ...d,
    label: shortDate(d.day),
  }))

  const total = activeDays.reduce((sum, d) => sum + d.count, 0)

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
      <div role="img" aria-label="Applications received each day" className="w-full">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={activeDays} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                <stop offset="60%" stopColor="#6366f1" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(128,128,128,0.12)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="url(#trendStroke)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#trendGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2.5 }}
              isAnimationActive={true}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
