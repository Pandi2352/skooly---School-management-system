import { Card } from '@/components/ui/Card'

export function DemographicBalanceCard() {
  const genderData = [
    { label: 'Boys', count: 68, pct: 54, color: 'bg-primary' },
    { label: 'Girls', count: 55, pct: 44, color: 'bg-purple-600' },
    { label: 'Other', count: 3, pct: 2, color: 'bg-teal-600' },
  ]

  const quotaData = [
    { label: 'General / Open Intake', count: 88, pct: 70, barClass: 'bg-primary' },
    { label: 'Right to Education (RTE)', count: 31, pct: 25, barClass: 'bg-accent' },
    { label: 'BPL / Fee Concession', count: 7, pct: 5, barClass: 'bg-emerald-600' },
  ]

  return (
    <Card
      title="Intake Demographics & Statutory Quotas"
      description="Gender parity and statutory quota allocation for the active academic cycle"
      className="min-w-0"
    >
      <div className="grid gap-5">
        {/* Gender Distribution Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-ink">Gender Distribution</span>
            <span className="text-ink-muted">126 Applicants</span>
          </div>
          {/* Multi-color segmented progress */}
          <div className="flex h-3.5 w-full overflow-hidden rounded-md bg-canvas ring-1 ring-line">
            {genderData.map((item) => (
              <div
                key={item.label}
                className={`${item.color} transition-all duration-500`}
                style={{ width: `${item.pct}%` }}
                title={`${item.label}: ${item.pct}% (${item.count})`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            {genderData.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`size-2.5 rounded-full ${item.color}`} aria-hidden="true" />
                <span className="text-ink-muted">{item.label}</span>
                <span className="font-bold tabular-nums text-ink">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quota Allocations */}
        <div className="border-t border-line pt-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-ink">Statutory Quota Distribution</span>
            <span className="text-ink-muted">Mandated vs Filled</span>
          </div>
          <div className="grid gap-2.5">
            {quotaData.map((q) => (
              <div key={q.label} className="grid gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">{q.label}</span>
                  <span className="tabular-nums">
                    <strong className="font-bold text-ink">{q.count}</strong>
                    <span className="text-ink-muted"> ({q.pct}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-sm bg-canvas">
                  <div
                    className={`h-2 rounded-sm ${q.barClass} transition-all duration-500`}
                    style={{ width: `${q.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
