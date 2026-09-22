import { DotsThreeVerticalIcon, EyeIcon, PencilSimpleIcon, PhoneIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import { Table, type TableColumn } from '@/components/ui/Table'
import { cn } from '@/lib/cn'
import type { StaffSummary } from '../types/staff.types'
import { staffFullName, typeLabel } from '../utils/staffStatus'
import { StaffStatusBadge } from './StaffStatusBadge'

type StaffTableProps = {
  staff: StaffSummary[]
  isLoading: boolean
  isRefreshing: boolean
  error?: string
  onRetry: () => void
  empty: ReactNode
}

export function StaffTable({
  staff,
  isLoading,
  isRefreshing,
  error,
  onRetry,
  empty,
}: StaffTableProps) {
  const navigate = useNavigate()

  const columns: TableColumn<StaffSummary>[] = [
    {
      key: 'name',
      header: 'Staff Member',
      cell: (member) => {
        const fullName = staffFullName(member.personalInfo)
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={fullName}
              src={member.photoUrl ?? undefined}
              size="sm"
            />
            <div className="min-w-0">
              <Link
                to={paths.staffMember(member.id)}
                className="block truncate font-semibold text-ink hover:text-primary hover:underline"
              >
                {fullName}
              </Link>
              <div className="text-xs text-ink-muted">
                {member.contactInfo.email ?? member.contactInfo.phone}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      key: 'employeeId',
      header: 'Employee ID',
      cell: (member) => (
        <span className="font-mono text-xs font-medium tabular-nums text-ink-muted">
          {member.employment.employeeId}
        </span>
      ),
    },
    {
      key: 'designation',
      header: 'Role & Dept',
      cell: (member) => (
        <div>
          <div className="font-medium text-ink">{member.employment.designation}</div>
          <div className="text-xs text-ink-muted">{member.employment.department}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (member) => (
        <span className="text-sm text-ink-muted">
          {typeLabel(member.employment.employmentType)}
        </span>
      ),
    },
    {
      key: 'joiningDate',
      header: 'Joined',
      cell: (member) => (
        <span className="text-sm tabular-nums text-ink-muted">
          {member.employment.dateOfJoining}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (member) => <StaffStatusBadge status={member.employment.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (member) => (
        <Dropdown
          trigger={
            <IconButton
              label="Staff actions"
              size="sm"
              icon={DotsThreeVerticalIcon}
            />
          }
        >
          <DropdownItem
            icon={EyeIcon}
            onSelect={() => {
              void navigate(paths.staffMember(member.id))
            }}
          >
            View profile
          </DropdownItem>
          <DropdownItem
            icon={PencilSimpleIcon}
            onSelect={() => {
              void navigate(paths.staffMemberEdit(member.id))
            }}
          >
            Edit profile
          </DropdownItem>
          <DropdownItem
            icon={PhoneIcon}
            onSelect={() => {
              window.open(`tel:${member.contactInfo.phone}`)
            }}
          >
            Call {member.contactInfo.phone}
          </DropdownItem>
        </Dropdown>
      ),
    },
  ]

  return (
    <div className={cn('relative transition-opacity', isRefreshing && 'opacity-60')}>
      <Table
        caption="Staff members"
        hideCaption
        columns={columns}
        rows={staff}
        getRowKey={(member) => member.id}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        empty={empty}
        bordered
      />
    </div>
  )
}
