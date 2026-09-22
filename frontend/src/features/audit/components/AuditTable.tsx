import { ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { EmptyState } from '@/components/page/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Table, type TableColumn } from '@/components/ui/Table'
import { cn } from '@/lib/cn'
import { AUDIT_ATTENTION_ACTIONS } from '../constants'
import type { AuditEvent } from '../types/audit.types'
import { formatEventTime } from '../utils/formatEventTime'

type AuditTableProps = {
  events: AuditEvent[]
  isLoading: boolean
  isRefreshing?: boolean
  error?: string
  onRetry?: () => void
  empty: ReactNode
}

const isAttention = (action: string) => (AUDIT_ATTENTION_ACTIONS as string[]).includes(action)

export function AuditTable({ events, isLoading, isRefreshing = false, error, onRetry, empty }: AuditTableProps) {
  const columns: TableColumn<AuditEvent>[] = [
    {
      key: 'at',
      header: 'When',
      cell: (event) => {
        const { absolute, relative } = formatEventTime(event.at)
        return (
          <span className="whitespace-nowrap">
            <span className="block text-ink">{relative}</span>
            <span className="block text-sm text-ink-muted">{absolute}</span>
          </span>
        )
      },
    },
    {
      key: 'label',
      header: 'Event',
      cell: (event) => (
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-ink">{event.label}</span>
          {isAttention(event.action) && <Badge tone="danger">Attention</Badge>}
        </span>
      ),
    },
    {
      key: 'targetName',
      header: 'Account',
      cell: (event) => event.targetName || <span className="text-ink-muted">—</span>,
    },
    {
      key: 'actorName',
      header: 'Done by',
      // Nobody was signed in: a failed sign-in, or a reset someone asked for themselves.
      cell: (event) => event.actorName || <span className="text-ink-muted">Not signed in</span>,
    },
    {
      key: 'summary',
      header: 'Details',
      cell: (event) => event.summary || <span className="text-ink-muted">—</span>,
    },
    {
      key: 'ip',
      header: 'From',
      cell: (event) => (
        <span className="whitespace-nowrap tabular-nums text-ink-muted">{event.ip || '—'}</span>
      ),
    },
  ]

  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn('transition-opacity motion-reduce:transition-none', isRefreshing && 'opacity-60')}
    >
      <Table
        caption="Audit trail"
        hideCaption
        bordered={false}
        columns={columns}
        primaryKey="label"
        rows={events}
        getRowKey={(event) => event.id}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        empty={empty ?? <EmptyState icon={ClockCounterClockwiseIcon} title="Nothing recorded yet" />}
      />
    </div>
  )
}
