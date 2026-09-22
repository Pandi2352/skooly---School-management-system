import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { EmptyState } from '@/components/page/EmptyState'
import { Card } from '@/components/ui/Card'
import type { AdmissionGradeCount } from '../../schemas/admissionPipeline.schema'

type GradeDemandChartProps = {
  grades: AdmissionGradeCount[]
}

const getGradeCapacity = (grade: number) => {
  if (grade <= 5) return 40
  if (grade <= 8) return 35
  return 30
}

type ChartRow = {
  name: string
  applied: number
  capacity: number
  ratio: number
  grade: number
}

function barColor(ratio: number) {
  if (ratio >= 100) return '#ef4444'
  if (ratio >= 80) return '#f59e0b'
  return '#10b981'
}

function GradeTooltip(props: Record<string, unknown>) {
  const { active, payload, label } = props as {
    active?: boolean
    payload?: { payload?: ChartRow }[]
    label?: string
  }
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  if (!row) return null
  const status = row.ratio >= 100 ? 'Waitlisted' : row.ratio >= 80 ? 'Filling Fast' : 'Seats Open'
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
      <p className="font-semibold text-ink">{label}</p>
      <p className="mt-1 tabular-nums text-ink-muted">
        Applied: <strong className="text-ink">{row.applied}</strong> &nbsp;/&nbsp;
        Capacity: <strong className="text-ink">{row.capacity}</strong>
      </p>
      <p className="mt-0.5 font-bold" style={{ color: barColor(row.ratio) }}>
        {row.ratio}% fill · {status}
      </p>
    </div>
  )
}

export function GradeDemandChart({ grades }: GradeDemandChartProps) {
  const busiest = grades.reduce<AdmissionGradeCount | null>(
    (leader, entry) => (leader === null || entry.count > leader.count ? entry : leader),
    null,
  )

  const chartData: ChartRow[] = grades.map((entry) => {
    const capacity = getGradeCapacity(entry.grade)
    const ratio = Math.round((entry.count / capacity) * 100)
    return {
      name: `Gr. ${entry.grade}`,
      applied: entry.count,
      capacity,
      ratio,
      grade: entry.grade,
    }
  })

  return (
    <Card
      title="Grade-wise Demand vs Sanctioned Capacity"
      description={
        busiest
          ? `Grade ${busiest.grade} has the highest applicant concentration`
          : 'Intake volume by academic grade'
      }
      className="min-w-0"
    >
      {grades.length === 0 ? (
        <EmptyState title="No applications yet" description="Grades appear here as families apply." />
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 46)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
            barCategoryGap="30%"
            barGap={3}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(128,128,128,0.1)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={42}
            />
            <Tooltip content={<GradeTooltip />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
            {/* Capacity ghost bar */}
            <Bar dataKey="capacity" fill="rgba(128,128,128,0.12)" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            </Bar>
            {/* Applications bar — colored by fill rate */}
            <Bar
              dataKey="applied"
              radius={[0, 4, 4, 0]}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((row) => (
                /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                <Cell key={row.name} fill={barColor(row.ratio)} />
              ))}
              <LabelList
                dataKey="ratio"
                position="right"
                formatter={(v: unknown) => `${String(v)}%`}
                style={{ fontSize: 10, fontWeight: 700, fill: '#6b7280' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
