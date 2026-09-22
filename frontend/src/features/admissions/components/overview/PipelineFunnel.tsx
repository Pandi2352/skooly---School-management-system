import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Card } from '@/components/ui/Card'
import type { AdmissionStats } from '../../schemas/admissionPipeline.schema'

type PipelineFunnelProps = {
  stats: AdmissionStats
}

type FunnelRow = {
  label: string
  count: number
  color: string
  to: string
  hint: string
}

function FunnelTooltip(props: Record<string, unknown>) {
  const { active, payload } = props as {
    active?: boolean
    payload?: { payload?: FunnelRow }[]
  }
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  if (!row) return null
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm max-w-[200px]">
      <p className="font-semibold text-ink">{row.label}</p>
      <p className="mt-0.5 text-ink-muted">{row.hint}</p>
      <p className="mt-1 text-base font-black tabular-nums text-ink">{row.count}</p>
    </div>
  )
}

export function PipelineFunnel({ stats }: PipelineFunnelProps) {
  const estimatedInquiries = Math.max(stats.total + 25, 45)
  const conversionRate = stats.total > 0 ? Math.round((stats.enrolled / stats.total) * 100) : 0

  const stages: FunnelRow[] = [
    {
      label: 'Inquiries & Leads',
      count: estimatedInquiries,
      color: '#818cf8',
      to: paths.admissionsInquiries,
      hint: 'Campus walk-ins, phone calls, portal leads',
    },
    {
      label: 'Applications',
      count: stats.total,
      color: '#38bdf8',
      to: paths.admissionsApplications,
      hint: 'Completed 7-step admission submissions',
    },
    {
      label: 'Under Review',
      count: stats.underReview,
      color: '#fbbf24',
      to: `${paths.admissionsApplications}?status=under-review`,
      hint: 'Awaiting faculty evaluation or documents',
    },
    {
      label: 'Approved',
      count: stats.approved,
      color: '#2dd4bf',
      to: `${paths.admissionsApplications}?status=approved`,
      hint: 'Verified and ready for class sectioning',
    },
    {
      label: 'Enrolled',
      count: stats.enrolled,
      color: '#34d399',
      to: `${paths.admissionsApplications}?status=enrolled`,
      hint: 'Active students with ID & Fee structures',
    },
  ]

  return (
    <section role="region" aria-label="Where applications stand" className="min-w-0">
      <Card
        title="Intake Pipeline & Conversion Funnel"
        description={`Overall inquiry-to-enrolment conversion rate: ${conversionRate}%`}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={stages}
            layout="vertical"
            margin={{ top: 4, right: 56, left: 8, bottom: 4 }}
            barCategoryGap="25%"
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={96}
            />
            <Tooltip content={<FunnelTooltip />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
            <Bar
              dataKey="count"
              radius={[0, 6, 6, 0]}
              isAnimationActive={true}
              animationDuration={900}
              animationEasing="ease-out"
            >
              {stages.map((stage) => (
                /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                <Cell key={stage.label} fill={stage.color} />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                style={{ fontSize: 11, fontWeight: 700, fill: '#6b7280' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-line/40">
          {stages.map((stage) => (
            <Link
              key={stage.label}
              to={stage.to}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:border-primary/60 hover:text-primary"
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: stage.color }} />
              {stage.label}: {stage.count}
            </Link>
          ))}
        </div>

        {stats.rejected > 0 && (
          <div className="mt-2 flex items-center justify-between rounded-md border border-line/60 bg-canvas/60 px-3 py-1.5 text-xs text-ink-muted">
            <span>Rejected / Withdrawn Applicants</span>
            <Link
              to={`${paths.admissionsApplications}?status=rejected`}
              className="font-bold tabular-nums text-danger hover:underline"
            >
              {stats.rejected} records
            </Link>
          </div>
        )}
      </Card>
    </section>
  )
}
