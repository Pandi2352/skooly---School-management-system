import { useState } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card } from '@/components/ui/Card'

type StaffDepartmentDonutProps = {
  byDepartment: Record<string, number>
}

// Tailored vibrant color palette for departments
const DEPARTMENT_COLORS: Record<string, string> = {
  Primary: '#6366f1', // Indigo
  Secondary: '#3b82f6', // Blue
  'Senior Secondary': '#8b5cf6', // Purple
  PrePrimary: '#ec4899', // Pink
  Administration: '#10b981', // Emerald
  Accounts: '#f59e0b', // Amber
  Library: '#06b6d4', // Cyan
  Sports: '#ef4444', // Red
  Transport: '#14b8a6', // Teal
  Hostel: '#84cc16', // Lime
  Support: '#64748b', // Slate
}

const DEFAULT_COLOR = '#0ea5e9'

function DonutTooltip(props: Record<string, unknown>) {
  const { active, payload } = props as {
    active?: boolean
    payload?: { name: string; value: number; payload: { percent: number; fill: string } }[]
  }
  if (!active || !payload?.length) return null
  const item = payload[0]
  if (!item) return null

  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: item.payload.fill }}
        />
        <span className="font-semibold text-ink">{item.name}</span>
      </div>
      <p className="mt-1 text-base font-bold tabular-nums text-ink">
        {item.value} <span className="text-xs font-normal text-ink-muted">staff ({Math.round(item.payload.percent * 100)}%)</span>
      </p>
    </div>
  )
}

export function StaffDepartmentDonut({ byDepartment }: StaffDepartmentDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const entries = Object.entries(byDepartment).filter(([, count]) => count > 0)
  const total = entries.reduce((acc, [, count]) => acc + count, 0)

  const data = entries.map(([dept, count]) => ({
    name: dept,
    value: count,
    percent: total > 0 ? count / total : 0,
    fill: DEPARTMENT_COLORS[dept] ?? DEFAULT_COLOR,
  }))

  return (
    <Card
      title="Department Distribution"
      description={`Workforce segmented across ${entries.length} operational wings`}
    >
      <div className="flex flex-col items-center sm:flex-row">
        <div className="relative h-60 w-full sm:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<DonutTooltip />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke="transparent"
                    className="transition-transform duration-200"
                    style={{
                      transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center center',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black tabular-nums text-ink">{total}</span>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted">Total Staff</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-1.5 pt-2 sm:w-1/2 sm:pt-0 sm:pl-2">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-canvas/60 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="size-2.5 rounded-full flex-none"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="truncate text-ink-muted">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tabular-nums text-ink">{item.value}</span>
                <span className="text-[11px] tabular-nums text-ink-muted">
                  ({Math.round(item.percent * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
