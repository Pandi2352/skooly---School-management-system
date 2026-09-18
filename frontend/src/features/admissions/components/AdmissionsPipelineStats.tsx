import {
  CheckCircleIcon,
  ClockIcon,
  GraduationCapIcon,
  UsersIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import type { AdmissionStats } from '../schemas/admissionPipeline.schema'

type Props = {
  stats: AdmissionStats | undefined
  isLoading: boolean
  activeStatus: string
  onSelectStatus: (status: string) => void
}

export function AdmissionsPipelineStats({
  stats,
  isLoading,
  activeStatus,
  onSelectStatus,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="mt-3 h-7 w-12" />
          </Card>
        ))}
      </div>
    )
  }

  const items = [
    {
      id: 'all',
      label: 'Total Applications',
      count: stats?.total ?? 0,
      icon: UsersIcon,
      color: 'text-primary bg-primary/10 border-primary/20',
      activeRing: 'ring-2 ring-primary',
    },
    {
      id: 'under-review',
      label: 'Under Review',
      count: stats?.underReview ?? 0,
      icon: ClockIcon,
      color: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800',
      activeRing: 'ring-2 ring-amber-500',
    },
    {
      id: 'approved',
      label: 'Approved (Ready)',
      count: stats?.approved ?? 0,
      icon: CheckCircleIcon,
      color: 'text-success bg-success-soft border-success/30',
      activeRing: 'ring-2 ring-success',
    },
    {
      id: 'enrolled',
      label: 'Enrolled in School',
      count: stats?.enrolled ?? 0,
      icon: GraduationCapIcon,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800',
      activeRing: 'ring-2 ring-emerald-500',
    },
    {
      id: 'rejected',
      label: 'Rejected / Archived',
      count: stats?.rejected ?? 0,
      icon: XCircleIcon,
      color: 'text-danger bg-danger-soft border-danger/30',
      activeRing: 'ring-2 ring-danger',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5" role="region" aria-label="Admissions pipeline metrics">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeStatus === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectStatus(item.id)}
            className={cn(
              'group relative flex flex-col justify-between rounded-md border border-line bg-surface p-4 text-start transition-all hover:border-ink/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              isActive && cn('bg-canvas/50 font-medium', item.activeRing),
            )}
            aria-pressed={isActive}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                {item.label}
              </span>
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md border',
                  item.color,
                )}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" weight="bold" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-ink">
                {item.count}
              </span>
              {isActive && (
                <span className="text-xs text-ink-muted">(Active Filter)</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
