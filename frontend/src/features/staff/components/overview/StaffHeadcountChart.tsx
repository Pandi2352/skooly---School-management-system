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

type StaffHeadcountChartProps = {
  currentTotal: number
}

// 12-month illustrative historical trend data
const MONTHLY_HEADCOUNT = [
  { month: 'Oct 25', total: 42, teaching: 30, nonTeaching: 12 },
  { month: 'Nov 25', total: 44, teaching: 31, nonTeaching: 13 },
  { month: 'Dec 25', total: 45, teaching: 32, nonTeaching: 13 },
  { month: 'Jan 26', total: 46, teaching: 33, nonTeaching: 13 },
  { month: 'Feb 26', total: 46, teaching: 33, nonTeaching: 13 },
  { month: 'Mar 26', total: 47, teaching: 34, nonTeaching: 13 },
  { month: 'Apr 26', total: 50, teaching: 36, nonTeaching: 14 },
  { month: 'May 26', total: 50, teaching: 36, nonTeaching: 14 },
  { month: 'Jun 26', total: 53, teaching: 38, nonTeaching: 15 },
  { month: 'Jul 26', total: 55, teaching: 39, nonTeaching: 16 },
  { month: 'Aug 26', total: 56, teaching: 40, nonTeaching: 16 },
  { month: 'Sep 26', total: 58, teaching: 41, nonTeaching: 17 },
]

function HeadcountTooltip(props: Record<string, unknown>) {
  const { active, payload, label } = props as {
    active?: boolean
    payload?: { name: string; value: number; color: string }[]
    label?: string
  }
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur-md">
      <p className="font-semibold text-ink">{label}</p>
      <div className="mt-1.5 space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-ink-muted">{item.name}:</span>
            </div>
            <span className="font-mono font-bold tabular-nums text-ink">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StaffHeadcountChart({ currentTotal }: StaffHeadcountChartProps) {
  const [range, setRange] = useState<6 | 12>(12)
  const data = MONTHLY_HEADCOUNT.slice(-range)

  return (
    <Card
      title="Staff Headcount Growth"
      description={`Monthly workforce trajectory • Current strength: ${currentTotal} members`}
      actions={
        <div className="flex items-center gap-1 rounded-md border border-line bg-canvas p-0.5">
          <button
            type="button"
            onClick={() => setRange(6)}
            className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
              range === 6
                ? 'bg-surface text-primary shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            6 Months
          </button>
          <button
            type="button"
            onClick={() => setRange(12)}
            className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
              range === 12
                ? 'bg-surface text-primary shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            1 Year
          </button>
        </div>
      }
    >
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="staffTeachingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="staffNonTeachingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#888888"
              strokeOpacity={0.15}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#8a94a3"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#8a94a3"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<HeadcountTooltip />} />
            <Area
              type="monotone"
              dataKey="teaching"
              name="Teaching Staff"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#staffTeachingGrad)"
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="nonTeaching"
              name="Non-Teaching Staff"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#staffNonTeachingGrad)"
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-6 border-t border-line/60 pt-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-blue-500" />
          <span className="text-ink-muted">Teaching Staff</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-emerald-500" />
          <span className="text-ink-muted">Non-Teaching & Admin</span>
        </div>
      </div>
    </Card>
  )
}
