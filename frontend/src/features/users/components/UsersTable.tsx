import { LockKeyIcon, UsersIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { EmptyState } from '@/components/page/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Table, type TableColumn } from '@/components/ui/Table'
import type { User } from '../types/user.types'
import { describeLastSignIn, type AccountContext } from '../utils/userRules'
import { UserRowActions, type UserAction } from './UserRowActions'
import { UserStatusBadge } from './UserStatusBadge'

type UsersTableProps = {
  users: User[]
  isLoading: boolean
  error?: string
  onRetry?: () => void
  context: AccountContext
  onAction: (action: UserAction, user: User) => void
  /** Shown when nothing matches; the caller says whether that is a filter or an empty school. */
  empty: ReactNode
}

export function UsersTable({ users, isLoading, error, onRetry, context, onAction, empty }: UsersTableProps) {
  const columns: TableColumn<User>[] = [
    {
      key: 'person',
      header: 'Person',
      cell: (user) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={user.fullName} size="sm" />
          <div className="min-w-0">
            <Link
              to={paths.user(user.id)}
              className="rounded-sm font-medium wrap-anywhere text-ink hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {user.fullName}
            </Link>
            <p className="text-sm wrap-anywhere text-ink-muted">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (user) => (
        <span className="flex flex-wrap items-center gap-1.5">
          {user.role?.name ?? <span className="text-ink-muted">No role</span>}
          {user.role?.fullAccess && <Badge tone="info">Full access</Badge>}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (user) => (
        <span className="flex flex-wrap items-center gap-1.5">
          <UserStatusBadge status={user.status} />
          {user.isLocked && (
            <Badge tone="danger" className="gap-1">
              <LockKeyIcon className="size-3.5" aria-hidden="true" />
              Locked
            </Badge>
          )}
          {user.mustChangePassword && <Badge tone="neutral">Temporary password</Badge>}
        </span>
      ),
    },
    {
      key: 'lastLoginAt',
      header: 'Last sign-in',
      cell: (user) => <span className="text-ink-muted">{describeLastSignIn(user.lastLoginAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (user) => <UserRowActions user={user} context={context} onAction={onAction} />,
    },
  ]

  return (
    <Table
      caption="Staff accounts"
      hideCaption
      columns={columns}
      rows={users}
      getRowKey={(user) => user.id}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? <EmptyState icon={UsersIcon} title="No accounts yet" />}
    />
  )
}
