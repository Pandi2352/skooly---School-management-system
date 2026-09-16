import { ArrowDownIcon, ArrowUpIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useDeleteCustomField, useMoveCustomField } from '../hooks/useCustomFields'
import type { CustomField } from '../types/customField.types'

type CustomFieldRowActionsProps = {
  field: CustomField
  isFirst: boolean
  isLast: boolean
  onEdit: (field: CustomField) => void
}

export function CustomFieldRowActions({
  field,
  isFirst,
  isLast,
  onEdit,
}: CustomFieldRowActionsProps) {
  const { toast } = useToast()
  const moveField = useMoveCustomField()
  const deleteField = useDeleteCustomField()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const move = (direction: 'up' | 'down') => {
    moveField.mutate(
      { id: field.id, direction },
      {
        onError: (error) =>
          toast({
            tone: 'error',
            title: 'Couldn’t move the field',
            description: getErrorMessage(error),
          }),
      },
    )
  }

  return (
    <div className="flex justify-end gap-0.5">
      <Tooltip content="Move up">
        <IconButton
          size="sm"
          icon={ArrowUpIcon}
          label={`Move ${field.label} up`}
          disabled={isFirst || moveField.isPending}
          onClick={() => move('up')}
        />
      </Tooltip>
      <Tooltip content="Move down">
        <IconButton
          size="sm"
          icon={ArrowDownIcon}
          label={`Move ${field.label} down`}
          disabled={isLast || moveField.isPending}
          onClick={() => move('down')}
        />
      </Tooltip>
      <Tooltip content="Edit">
        <IconButton
          size="sm"
          icon={PencilSimpleIcon}
          label={`Edit ${field.label}`}
          onClick={() => onEdit(field)}
        />
      </Tooltip>
      <Tooltip content="Delete">
        <IconButton
          size="sm"
          icon={TrashIcon}
          label={`Delete ${field.label}`}
          className="hover:text-danger"
          onClick={() => setConfirmOpen(true)}
        />
      </Tooltip>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${field.label}?`}
        description="The admission form stops asking for it. To keep it for later, edit the field and untick “Show on the admission form” instead."
        confirmLabel="Delete field"
        onConfirm={async () => {
          try {
            await deleteField.mutateAsync(field.id)
            toast({ title: 'Field deleted', description: field.label })
          } catch (error) {
            toast({
              tone: 'error',
              title: 'Couldn’t delete the field',
              description: getErrorMessage(error),
            })
          }
        }}
      />
    </div>
  )
}
