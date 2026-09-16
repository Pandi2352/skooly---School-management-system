import {
  DotsThreeVerticalIcon,
  EyeIcon,
  PencilSimpleIcon,
  TrashIcon,
  UserMinusIcon,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { iconButtonClasses } from '@/components/ui/buttonStyles'
import { Dropdown, DropdownItem, DropdownLabel } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import type { Student } from '../types/student.types'

export function StudentRowActions({ student }: { student: Student }) {
  return (
    <div className="inline-flex items-center gap-1 print:hidden">
      <Tooltip content="View profile">
        <Link
          to={paths.student(student.id)}
          aria-label={`View profile of ${student.name}`}
          className={iconButtonClasses({ size: 'sm' })}
        >
          <EyeIcon className="size-4.5" aria-hidden="true" />
        </Link>
      </Tooltip>
      <Dropdown
        trigger={
          <IconButton
            label={`More actions for ${student.name}`}
            icon={DotsThreeVerticalIcon}
            size="sm"
          />
        }
      >
        {/* TODO(api): enable each action once its endpoint exists; delete needs a ConfirmDialog. */}
        <DropdownLabel>Coming soon</DropdownLabel>
        <DropdownItem icon={PencilSimpleIcon} disabled>
          Edit details
        </DropdownItem>
        <DropdownItem icon={UserMinusIcon} disabled>
          Mark as left
        </DropdownItem>
        <DropdownItem icon={TrashIcon} tone="danger" disabled>
          Delete student
        </DropdownItem>
      </Dropdown>
    </div>
  )
}
