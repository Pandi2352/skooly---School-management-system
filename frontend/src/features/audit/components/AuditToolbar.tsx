import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import type { AuditListQuery } from '../api/audit'
import {
  AUDIT_ACTION_GROUPS,
  AUDIT_ACTION_LABELS,
  AUDIT_PERIODS,
  AUDIT_PERIOD_LABELS,
  type AuditPeriod,
} from '../constants'

type AuditToolbarProps = {
  query: AuditListQuery
  isFiltered: boolean
  onChange: (changes: Partial<AuditListQuery>) => void
  onReset: () => void
}

/** Period and event type on the left, search on the right, matching the other list pages. */
export function AuditToolbar({ query, isFiltered, onChange, onReset }: AuditToolbarProps) {
  const actionOptions = [
    { value: 'all', label: 'All events' },
    ...AUDIT_ACTION_GROUPS.flatMap((group) =>
      group.actions.map((action) => ({ value: action, label: `${group.label}: ${AUDIT_ACTION_LABELS[action]}` })),
    ),
  ]

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-44">
          <Select
            label="Period"
            hideLabel
            size="sm"
            value={query.period}
            onValueChange={(period) => onChange({ period: period as AuditPeriod })}
            options={AUDIT_PERIODS.map((period) => ({ value: period, label: AUDIT_PERIOD_LABELS[period] }))}
          />
        </div>

        <div className="w-64">
          <Select
            label="Event type"
            hideLabel
            size="sm"
            value={query.action}
            onValueChange={(action) => onChange({ action: action as AuditListQuery['action'] })}
            options={actionOptions}
          />
        </div>

        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="lg:w-72">
        <SearchInput
          label="Search the trail by person or account"
          placeholder="Search person or account"
          value={query.search}
          onValueChange={(search) => onChange({ search })}
        />
      </div>
    </>
  )
}
