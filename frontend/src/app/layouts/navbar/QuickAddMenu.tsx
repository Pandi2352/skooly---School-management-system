import {
  CaretDownIcon,
  ClockIcon,
  GraduationCapIcon,
  PlusCircleIcon,
  ReceiptIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'

export function QuickAddMenu() {
  const navigate = useNavigate()

  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          className="flex h-9 items-center gap-1 rounded-md px-2 text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-11"
          aria-label="Quick create"
        >
          <Tooltip content="Quick actions">
            <span className="flex items-center gap-1">
              <PlusCircleIcon
                className="size-5 text-ink-muted"
                weight="regular"
                aria-hidden="true"
              />
              <CaretDownIcon className="size-3 text-ink-muted" aria-hidden="true" />
            </span>
          </Tooltip>
        </button>
      }
    >
      <DropdownLabel>Quick Actions</DropdownLabel>
      <DropdownSeparator />
      <DropdownItem
        icon={GraduationCapIcon}
        onSelect={() => {
          void navigate('/students/admission')
        }}
      >
        New Student Admission
      </DropdownItem>
      <DropdownItem
        icon={ReceiptIcon}
        onSelect={() => {
          void navigate('/fees-finance/fee-collection')
        }}
      >
        Collect Fee Payment
      </DropdownItem>
      <DropdownItem
        icon={ClockIcon}
        onSelect={() => {
          void navigate('/students/student-attendance')
        }}
      >
        Take Student Attendance
      </DropdownItem>
      <DropdownItem
        icon={UsersThreeIcon}
        onSelect={() => {
          void navigate('/hr-staff-management/staff-management')
        }}
      >
        Add Staff Member
      </DropdownItem>
      <DropdownItem
        icon={GraduationCapIcon}
        onSelect={() => {
          void navigate('/students/tc-exit')
        }}
      >
        Issue Transfer Certificate
      </DropdownItem>
    </Dropdown>
  )
}
