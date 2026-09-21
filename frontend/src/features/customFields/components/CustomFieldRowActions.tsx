import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotsThreeVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import type { CustomField } from '../types/customField.types'

export type CustomFieldAction = 'edit' | 'move-up' | 'move-down' | 'toggle' | 'delete'

type CustomFieldRowActionsProps = {
  field: CustomField
  isFirst: boolean
  isLast: boolean
  onAction: (action: CustomFieldAction, field: CustomField) => void
}

/**
 * Moving is what people do most here, so the arrows sit in the row rather than inside a menu; the
 * rest are one click further in.
 */
export function CustomFieldRowActions({ field, isFirst, isLast, onAction }: CustomFieldRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content={isFirst ? 'Already first' : `Ask ${field.label} earlier`}>
        <IconButton
          label={`Move ${field.label} up`}
          icon={ArrowUpIcon}
          size="sm"
          disabled={isFirst}
          onClick={() => onAction('move-up', field)}
        />
      </Tooltip>
      <Tooltip content={isLast ? 'Already last' : `Ask ${field.label} later`}>
        <IconButton
          label={`Move ${field.label} down`}
          icon={ArrowDownIcon}
          size="sm"
          disabled={isLast}
          onClick={() => onAction('move-down', field)}
        />
      </Tooltip>

      <Dropdown
        trigger={<IconButton label={`More actions for ${field.label}`} icon={DotsThreeVerticalIcon} size="sm" />}
      >
        <DropdownItem icon={PencilSimpleIcon} onSelect={() => onAction('edit', field)}>
          <span>Edit question</span>
        </DropdownItem>
        <DropdownItem
          icon={field.active ? EyeSlashIcon : EyeIcon}
          onSelect={() => onAction('toggle', field)}
        >
          <span className="grid">
            <span>{field.active ? 'Hide from the form' : 'Show on the form'}</span>
            <span className="text-xs font-normal text-ink-muted">
              {field.active ? 'Past answers are kept' : 'Asked again from now on'}
            </span>
          </span>
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon={TrashIcon} tone="danger" onSelect={() => onAction('delete', field)}>
          <span>Remove question</span>
        </DropdownItem>
      </Dropdown>
    </div>
  )
}
