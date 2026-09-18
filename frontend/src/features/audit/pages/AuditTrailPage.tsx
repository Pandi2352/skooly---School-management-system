import { ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import { EmptyState } from '@/components/page/EmptyState'
import { PageContainer } from '@/components/page/PageContainer'
import { RecordsCard } from '@/components/page/RecordsCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { formatNumber } from '@/lib/format'
import { AuditTable } from '../components/AuditTable'
import { AuditToolbar } from '../components/AuditToolbar'
import { AUDIT_PERIOD_LABELS } from '../constants'
import { useAuditEvents } from '../hooks/useAuditEvents'
import { useAuditFilters } from '../hooks/useAuditFilters'

// The page composes: filters from the URL, data from a query hook, rendering from components.
export function AuditTrailPage() {
  const { query, update, reset, isFiltered } = useAuditFilters()
  const events = useAuditEvents(query)
  const meta = events.data?.meta

  return (
    <PageContainer
      title="Audit Trail"
      description="Who signed in, who was shut out, and every change made to an account."
      status={
        meta && (
          <ul aria-label="Trail totals" className="flex flex-wrap gap-1.5">
            <li>
              <Badge tone="neutral">
                {formatNumber(meta.total)} event{meta.total === 1 ? '' : 's'} in this view
              </Badge>
            </li>
            <li>
              <Badge tone="neutral">Kept for {formatNumber(meta.retentionDays)} days</Badge>
            </li>
          </ul>
        )
      }
      fullWidth
    >
      {/* grid-cols-1 is minmax(0, 1fr): without it the column grows to the table's full width
          and the whole page scrolls sideways instead of the table. */}
      <div className="grid min-w-0 grid-cols-1 gap-5">
        <RecordsCard
          title={AUDIT_PERIOD_LABELS[query.period]}
          icon={ClockCounterClockwiseIcon}
          toolbar={<AuditToolbar query={query} isFiltered={isFiltered} onChange={update} onReset={reset} />}
          footer={
            meta && meta.total > meta.limit ? (
              <Pagination
                page={meta.page}
                pageCount={meta.totalPages}
                total={meta.total}
                pageSize={meta.limit}
                itemLabel="events"
                onPageChange={(page) => update({ page })}
              />
            ) : undefined
          }
        >
          <AuditTable
            events={events.data?.events ?? []}
            isLoading={events.isPending}
            isRefreshing={events.isPlaceholderData}
            error={events.isError ? getErrorMessage(events.error) : undefined}
            onRetry={() => void events.refetch()}
            empty={
              isFiltered ? (
                <EmptyState
                  icon={ClockCounterClockwiseIcon}
                  title="Nothing matches these filters"
                  description="Try a longer period, a different event type, or clear the filters."
                  action={
                    <Button variant="secondary" onClick={reset}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={ClockCounterClockwiseIcon}
                  title="Nothing recorded in this period"
                  description="Sign-ins and account changes appear here as they happen. Try a longer period to see older events."
                />
              )
            }
          />
        </RecordsCard>
      </div>
    </PageContainer>
  )
}
