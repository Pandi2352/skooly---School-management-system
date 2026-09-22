import { UsersIcon } from '@phosphor-icons/react'
import type { JobPosting } from '../types/staff.types'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'

type JobPostingCardProps = {
  job: JobPosting
  isSelected: boolean
  applicantCount: number
  onSelect: () => void
}

export function JobPostingCard({
  job,
  isSelected,
  applicantCount,
  onSelect,
}: JobPostingCardProps) {
  const statusTone =
    job.status === 'open'
      ? 'success'
      : job.status === 'filled'
        ? 'info'
        : 'neutral'

  return (
    <div
      onClick={onSelect}
      className={cn(
        'cursor-pointer rounded-md border p-4 transition-all',
        isSelected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-line bg-surface hover:border-control hover:bg-canvas/40',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-semibold text-ink truncate">{job.title}</h4>
          <p className="text-xs text-ink-muted">{job.department}</p>
        </div>
        <Badge tone={statusTone} className="capitalize flex-none">
          {job.status}
        </Badge>
      </div>

      <p className="mt-2 line-clamp-2 text-xs text-ink-muted">
        {job.description}
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs text-ink-muted">
        <div className="flex items-center gap-1.5">
          <UsersIcon className="size-3.5 text-primary" />
          <span>
            {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-ink">
          <span>{applicantCount} applied</span>
        </div>
      </div>
    </div>
  )
}
