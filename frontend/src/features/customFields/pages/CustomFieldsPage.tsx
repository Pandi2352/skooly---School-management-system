import { AsteriskIcon, EyeSlashIcon, ListChecksIcon, PlusIcon, TextboxIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { CountRail, type CountSegment } from '@/components/page/CountRail'
import { EmptyState } from '@/components/page/EmptyState'
import { PageContainer } from '@/components/page/PageContainer'
import { RecordsCard } from '@/components/page/RecordsCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Dialog } from '@/components/ui/Dialog'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { CustomFieldForm } from '../components/CustomFieldForm'
import { CustomFieldPreview } from '../components/CustomFieldPreview'
import { CustomFieldsTable } from '../components/CustomFieldsTable'
import type { CustomFieldAction } from '../components/CustomFieldRowActions'
import { CUSTOM_FIELD_PERMISSIONS } from '../constants'
import {
  useCustomFields,
  useDeleteCustomField,
  useMoveCustomField,
  useUpdateCustomField,
} from '../hooks/useCustomFields'
import type { CustomField } from '../types/customField.types'

// The page composes: data from query hooks, rules in the service, rendering from components.
export function CustomFieldsPage() {
  const fields = useCustomFields()
  const moveField = useMoveCustomField()
  const updateField = useUpdateCustomField()
  const deleteField = useDeleteCustomField()
  const { can } = usePermissions()
  const { toast } = useToast()

  // 'new' while adding, the question while editing, null when the dialog is closed.
  const [editing, setEditing] = useState<CustomField | 'new' | null>(null)
  const [removing, setRemoving] = useState<CustomField | null>(null)

  const rows = fields.data?.fields ?? []
  const meta = fields.data?.meta
  const mayAdd = can(CUSTOM_FIELD_PERMISSIONS.create)
  const isFull = meta !== undefined && meta.total >= meta.limit

  const segments: CountSegment[] = [
    {
      id: 'active',
      label: 'Asked on the form',
      count: meta?.active ?? 0,
      icon: ListChecksIcon,
      tone: 'success',
    },
    {
      id: 'required',
      label: 'Must be answered',
      count: meta?.required ?? 0,
      icon: AsteriskIcon,
      tone: 'primary',
    },
    {
      id: 'hidden',
      label: 'Hidden',
      count: (meta?.total ?? 0) - (meta?.active ?? 0),
      icon: EyeSlashIcon,
    },
  ]

  const runAction = async (action: CustomFieldAction, field: CustomField) => {
    try {
      switch (action) {
        case 'edit':
          setEditing(field)
          return
        case 'delete':
          setRemoving(field)
          return
        case 'toggle': {
          const updated = await updateField.mutateAsync({ id: field.id, input: { ...field, active: !field.active } })
          toast.success(
            updated.active ? 'Question shown' : 'Question hidden',
            updated.active
              ? `The admission form asks “${updated.label}” again.`
              : `“${updated.label}” is no longer asked. Answers already given are kept.`,
          )
          return
        }
        case 'move-up':
        case 'move-down':
          await moveField.mutateAsync({ id: field.id, direction: action === 'move-up' ? 'up' : 'down' })
          return
      }
    } catch (error) {
      toast.error('That didn’t work', getErrorMessage(error))
    }
  }

  const confirmRemove = async () => {
    if (!removing) return
    try {
      const label = await deleteField.mutateAsync(removing.id)
      toast.success('Question removed', `The admission form no longer asks “${label}”.`)
    } catch (error) {
      toast.error('Couldn’t remove the question', getErrorMessage(error))
    } finally {
      setRemoving(null)
    }
  }

  return (
    <PageContainer
      title="Custom Fields"
      description="Extra questions your school asks on the student admission form, in the order they are asked."
      actions={
        mayAdd && (
          <Button onClick={() => setEditing('new')} disabled={isFull}>
            <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
            Add question
          </Button>
        )
      }
      fullWidth
    >
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-4">
          {meta && <CountRail label="Question totals" segments={segments} />}

          {isFull && (
            <Alert tone="warning" title="This form is full">
              It already has {meta.limit} extra questions. Remove or hide one before adding another.
            </Alert>
          )}

          <RecordsCard
            title="Extra questions"
            icon={TextboxIcon}
            toolbar={
              <>
                <p className="text-sm text-ink-muted">
                  Asked under Additional details on{' '}
                  <Link
                    to={paths.studentNew}
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    Student Admission
                  </Link>
                  .
                </p>
                <p className="ms-auto text-sm text-ink-muted">Use the arrows to change the order.</p>
              </>
            }
          >
            <CustomFieldsTable
              fields={rows}
              isLoading={fields.isPending}
              isRefreshing={moveField.isPending}
              error={fields.isError ? getErrorMessage(fields.error) : undefined}
              onRetry={() => void fields.refetch()}
              onAction={(action, field) => void runAction(action, field)}
              empty={
                <EmptyState
                  icon={TextboxIcon}
                  title="No extra questions yet"
                  description="The admission form already asks the usual details. Add a question when your school needs something more, like a birth mark or a previous board."
                  action={mayAdd ? <Button onClick={() => setEditing('new')}>Add the first question</Button> : undefined}
                />
              }
            />
          </RecordsCard>
        </div>

        <CustomFieldPreview fields={rows} />
      </div>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        title={editing === 'new' ? 'Add a question' : 'Edit question'}
      >
        {editing !== null && (
          <CustomFieldForm field={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />
        )}
      </Dialog>

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null)
        }}
        title={`Remove “${removing?.label ?? ''}”?`}
        description="Hiding it is usually the better choice: a removed question leaves any answers already given with nothing to explain them. Hiding stops the form asking while keeping that record."
        confirmLabel="Remove anyway"
        tone="danger"
        onConfirm={confirmRemove}
      />
    </PageContainer>
  )
}
