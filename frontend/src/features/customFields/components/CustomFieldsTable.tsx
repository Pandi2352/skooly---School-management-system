import { TextboxIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { EmptyState } from '@/components/page/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Table, type TableColumn } from '@/components/ui/Table'
import { cn } from '@/lib/cn'
import { CUSTOM_FIELD_TYPE_LABELS } from '../constants'
import type { CustomField } from '../types/customField.types'
import { CustomFieldRowActions, type CustomFieldAction } from './CustomFieldRowActions'

type CustomFieldsTableProps = {
  fields: CustomField[]
  isLoading: boolean
  isRefreshing?: boolean
  error?: string
  onRetry?: () => void
  onAction: (action: CustomFieldAction, field: CustomField) => void
  empty: ReactNode
}

/** The questions in the order the form asks them. Order is the point, so the number leads. */
export function CustomFieldsTable({
  fields,
  isLoading,
  isRefreshing = false,
  error,
  onRetry,
  onAction,
  empty,
}: CustomFieldsTableProps) {
  const columns: TableColumn<CustomField>[] = [
    {
      key: 'position',
      header: '#',
      cell: (field) => (
        <span className="tabular-nums text-ink-muted">{fields.indexOf(field) + 1}</span>
      ),
    },
    {
      key: 'label',
      header: 'Question',
      cell: (field) => (
        <div className="grid min-w-40 gap-0.5">
          <span className={cn('font-semibold', field.active ? 'text-ink' : 'text-ink-muted')}>
            {field.label}
          </span>
          {field.helpText && <span className="text-sm text-ink-muted">{field.helpText}</span>}
          {/* The name answers are saved under. It never changes, so it is worth showing. */}
          <span className="font-mono text-xs text-ink-muted">{field.key}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Answer',
      cell: (field) => (
        <span className="flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">{CUSTOM_FIELD_TYPE_LABELS[field.type]}</Badge>
          {field.type === 'select' && (
            <span className="text-sm whitespace-nowrap text-ink-muted">
              {field.options.length} choice{field.options.length === 1 ? '' : 's'}
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'On the form',
      cell: (field) => (
        <span className="flex flex-wrap items-center gap-1.5">
          <Badge tone={field.active ? 'success' : 'neutral'}>{field.active ? 'Shown' : 'Hidden'}</Badge>
          {field.active && field.required && <Badge tone="info">Required</Badge>}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (field) => (
        <CustomFieldRowActions
          field={field}
          isFirst={fields.indexOf(field) === 0}
          isLast={fields.indexOf(field) === fields.length - 1}
          onAction={onAction}
        />
      ),
    },
  ]

  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn('transition-opacity motion-reduce:transition-none', isRefreshing && 'opacity-60')}
    >
      <Table
        caption="Extra questions on the admission form"
        hideCaption
        bordered={false}
        columns={columns}
        primaryKey="label"
        rows={fields}
        getRowKey={(field) => field.id}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        empty={empty ?? <EmptyState icon={TextboxIcon} title="No extra questions yet" />}
      />
    </div>
  )
}
