import { PlusIcon, TextboxIcon } from '@phosphor-icons/react'
import { EmptyState } from '@/components/page/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, type TableColumn } from '@/components/ui/Table'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { CUSTOM_FIELD_TYPE_LABELS } from '../constants'
import { useCustomFields } from '../hooks/useCustomFields'
import type { CustomField } from '../types/customField.types'
import { CustomFieldRowActions } from './CustomFieldRowActions'

type CustomFieldsTableProps = {
  onAdd: () => void
  onEdit: (field: CustomField) => void
}

export function CustomFieldsTable({ onAdd, onEdit }: CustomFieldsTableProps) {
  const fields = useCustomFields()
  const rows = fields.data ?? []

  const columns: TableColumn<CustomField>[] = [
    {
      key: 'order',
      header: '#',
      cell: (row) => <span className="text-ink-muted">{rows.indexOf(row) + 1}</span>,
    },
    {
      key: 'label',
      header: 'Field',
      cell: (row) => (
        <div className="grid gap-0.5">
          <span className="font-semibold text-ink">{row.label}</span>
          <span className="font-mono text-xs text-ink-muted">{row.key}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (row) => (
        <span className="whitespace-nowrap">
          <Badge>{CUSTOM_FIELD_TYPE_LABELS[row.type]}</Badge>
          {row.type === 'select' && (
            <span className="ms-2 text-ink-muted">{row.options.length} options</span>
          )}
        </span>
      ),
    },
    {
      key: 'required',
      header: 'Required',
      cell: (row) => (row.required ? 'Required' : 'Optional'),
    },
    {
      key: 'status',
      header: 'On form',
      cell: (row) => (
        <Badge tone={row.active ? 'success' : 'neutral'}>{row.active ? 'Shown' : 'Hidden'}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (row) => (
        <CustomFieldRowActions
          field={row}
          isFirst={rows.indexOf(row) === 0}
          isLast={rows.indexOf(row) === rows.length - 1}
          onEdit={onEdit}
        />
      ),
    },
  ]

  return (
    <Table
      caption="Custom fields"
      hideCaption
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      isLoading={fields.isPending}
      error={fields.isError ? getErrorMessage(fields.error) : undefined}
      onRetry={() => void fields.refetch()}
      empty={
        <EmptyState
          icon={TextboxIcon}
          title="No custom fields yet"
          description="Add a field to ask something extra on the student admission form."
          action={
            <Button onClick={onAdd}>
              <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
              Add field
            </Button>
          }
        />
      }
    />
  )
}
