import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/Card'

const STRENGTH_DATA = [
  { department: 'Primary', current: 18, sanctioned: 20 },
  { department: 'Secondary', current: 15, sanctioned: 16 },
  { department: 'Sr Secondary', current: 12, sanctioned: 14 },
  { department: 'PrePrimary', current: 8, sanctioned: 8 },
  { department: 'Admin', current: 5, sanctioned: 6 },
]

function StrengthTooltip(props: Record<string, unknown>) {
  const { active, payload, label } = props as {
    active?: boolean
    payload?: { name: string; value: number; color: string }[]
    label?: string
  }
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
      <p className="font-semibold text-ink">{label}</p>
      <div className="mt-1 space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-ink-muted">{item.name}:</span>
            </div>
            <span className="font-bold tabular-nums text-ink">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DepartmentStrengthChart() {
  return (
    <Card
      title="Department Staffing vs Sanctioned"
      description="Comparing active staff against approved establishment strength"
    >
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={STRENGTH_DATA}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#888888"
              strokeOpacity={0.15}
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#8a94a3"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="department"
              stroke="#8a94a3"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={85}
            />
            <Tooltip content={<StrengthTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="current"
              name="Active Staff"
              fill="#0284c7"
              radius={[0, 4, 4, 0]}
              isAnimationActive
              animationDuration={1000}
            />
            <Bar
              dataKey="sanctioned"
              name="Sanctioned Posts"
              fill="#cbd5e1"
              radius={[0, 4, 4, 0]}
              isAnimationActive
              animationDuration={1300}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
