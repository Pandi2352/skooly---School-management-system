import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Legend,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/Card'

type GenderRow = { name: string; value: number; fill: string }
type QuotaRow = { name: string; value: number; fill: string }

const GENDER_DATA: GenderRow[] = [
  { name: 'Boys',  value: 54, fill: '#6366f1' },
  { name: 'Girls', value: 44, fill: '#ec4899' },
  { name: 'Other', value: 2,  fill: '#10b981' },
]

const QUOTA_DATA: QuotaRow[] = [
  { name: 'General / Open',   value: 88, fill: '#6366f1' },
  { name: 'RTE (Right to Ed)', value: 31, fill: '#f59e0b' },
  { name: 'BPL / Fee Concession', value: 7, fill: '#10b981' },
]

function QuotaTooltip(props: Record<string, unknown>) {
  const { active, payload } = props as {
    active?: boolean
    payload?: { name?: string; value?: number }[]
  }
  if (!active || !payload?.length) return null
  const item = payload[0]
  if (!item) return null
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
      <p className="font-semibold text-ink">{item.name}</p>
      <p className="mt-0.5 tabular-nums font-black text-ink">{item.value} applicants</p>
    </div>
  )
}

export function DemographicBalanceCard() {
  return (
    <Card
      title="Intake Demographics & Statutory Quotas"
      description="Gender parity and statutory quota allocation for the active academic cycle"
      className="min-w-0"
    >
      <div className="grid gap-6">
        {/* Gender — Radial Bar */}
        <div>
          <p className="mb-1 text-xs font-semibold text-ink">Gender Distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart
              cx="50%"
              cy="55%"
              innerRadius={28}
              outerRadius={70}
              data={GENDER_DATA}
              startAngle={90}
              endAngle={-270}
              barSize={14}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: 'rgba(128,128,128,0.08)' }}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {GENDER_DATA.map((entry) => (
                  /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="value"
                  position="insideStart"
                  formatter={(v: unknown) => `${String(v)}%`}
                  style={{ fontSize: 10, fontWeight: 700, fill: '#fff' }}
                />
              </RadialBar>
              <Legend
                iconType="circle"
                iconSize={8}
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value: string) => (
                  <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>
                )}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Quota — Horizontal BarChart */}
        <div className="border-t border-line pt-4">
          <p className="mb-2 text-xs font-semibold text-ink">Statutory Quota Distribution</p>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart
              data={QUOTA_DATA}
              layout="vertical"
              margin={{ top: 2, right: 48, left: 4, bottom: 2 }}
              barCategoryGap="30%"
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip content={<QuotaTooltip />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
              <Bar
                dataKey="value"
                radius={[0, 6, 6, 0]}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {QUOTA_DATA.map((entry) => (
                  /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  style={{ fontSize: 10, fontWeight: 700, fill: '#6b7280' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
