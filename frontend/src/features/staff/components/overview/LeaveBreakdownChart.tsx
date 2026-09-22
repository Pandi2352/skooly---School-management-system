import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/Card'

// Illustrative leave consumption figures for current academic year
const LEAVE_DATA = [
  { type: 'Casual', days: 48, fill: '#3b82f6', allowance: 120 },
  { type: 'Medical', days: 24, fill: '#ef4444', allowance: 80 },
  { type: 'Earned', days: 36, fill: '#10b981', allowance: 150 },
  { type: 'Maternity', days: 90, fill: '#ec4899', allowance: 180 },
  { type: 'Paternity', days: 10, fill: '#8b5cf6', allowance: 30 },
  { type: 'Unpaid', days: 6, fill: '#64748b', allowance: 0 },
]

function LeaveTooltip(props: Record<string, unknown>) {
  const { active, payload } = props as {
    active?: boolean
    payload?: { payload: { type: string; days: number; fill: string } }[]
  }
  if (!active || !payload?.length) return null
  const first = payload[0]
  if (!first) return null
  const item = first.payload

  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ backgroundColor: item.fill }} />
        <span className="font-semibold text-ink">{item.type} Leave</span>
      </div>
      <p className="mt-1 text-base font-bold tabular-nums text-ink">
        {item.days} <span className="text-xs font-normal text-ink-muted">total days taken</span>
      </p>
    </div>
  )
}

export function LeaveBreakdownChart() {
  const totalDays = LEAVE_DATA.reduce((sum, item) => sum + item.days, 0)

  return (
    <Card
      title="Leave Utilization by Category"
      description={`${totalDays} cumulative leave days taken across all faculty & staff`}
    >
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={LEAVE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#888888"
              strokeOpacity={0.15}
              vertical={false}
            />
            <XAxis
              dataKey="type"
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
            />
            <Tooltip content={<LeaveTooltip />} />
            <Bar
              dataKey="days"
              radius={[6, 6, 0, 0]}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {LEAVE_DATA.map((entry, index) => (
                /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                <Cell key={`bar-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 border-t border-line/60 pt-3 text-xs">
        {LEAVE_DATA.map((item) => (
          <div key={item.type} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-ink-muted">{item.type}:</span>
            <span className="font-semibold tabular-nums text-ink">{item.days}d</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
