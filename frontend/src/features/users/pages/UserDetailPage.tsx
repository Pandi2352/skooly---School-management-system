import { ArrowLeftIcon, LockKeyIcon } from '@phosphor-icons/react'
import { Link, useParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { EmptyState } from '@/components/page/EmptyState'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { SessionList } from '@/features/auth/components/SessionList'
import { useSession } from '@/features/auth/hooks/useSession'
import { useRoles } from '@/features/roles/hooks/useRoles'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { AccountHistoryCard } from '../components/AccountHistoryCard'
import { UserRowActions } from '../components/UserRowActions'
import { UserStatusBadge } from '../components/UserStatusBadge'
import { useAccountActions } from '../hooks/useAccountActions'
import { useUser, useUserAudit, useUserSessions, useUsers } from '../hooks/useUsers'
import { describeLastSignIn } from '../utils/userRules'

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleString() : '—')

/** One account in full: who they are, what they may do, and where they are signed in. */
export function UserDetailPage() {
  const { userId = '' } = useParams()
  const account = useUser(userId)
  const sessions = useUserSessions(userId)
  const history = useUserAudit(userId)
  const roles = useRoles()
  const session = useSession()
  // The administrator count comes from the list's meta, which the last-administrator rules need.
  const counts = useUsers({
    search: '',
    status: 'active',
    roleId: 'all',
    page: 1,
    limit: 1,
    sortBy: 'fullName',
    sortOrder: 'asc',
  })
  const { runAction, dialogs } = useAccountActions(roles.data ?? [])

  if (account.isPending) return <LoadingState label="Loading the account" />

  if (account.isError || !account.data) {
    return (
      <PageContainer title="Account">
        <EmptyState
          title="This account couldn’t be loaded"
          description={getErrorMessage(account.error)}
          action={
            <Link to={paths.users} className={buttonClasses({ variant: 'secondary' })}>
              Back to User Accounts
            </Link>
          }
        />
      </PageContainer>
    )
  }

  const user = account.data
  const context = {
    currentUserId: session.data?.user.id ?? '',
    administratorCount: counts.data?.meta.administrators ?? 0,
  }

  const details: { label: string; value: string }[] = [
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone || '—' },
    { label: 'Designation', value: user.designation || '—' },
    { label: 'Role', value: user.role?.name ?? 'No role' },
    { label: 'Last sign-in', value: describeLastSignIn(user.lastLoginAt) },
    { label: 'Invitation sent', value: formatDate(user.invitedAt) },
    { label: 'Password first set', value: formatDate(user.activatedAt) },
    { label: 'Account created', value: formatDate(user.createdAt) },
  ]

  return (
    <PageContainer
      title={user.fullName}
      eyebrow={
        <Link
          to={paths.users}
          className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          User Accounts
        </Link>
      }
      status={
        <span className="flex flex-wrap items-center gap-1.5">
          <UserStatusBadge status={user.status} />
          {user.role?.fullAccess && <Badge tone="info">Full access</Badge>}
          {user.isLocked && (
            <Badge tone="danger" className="gap-1">
              <LockKeyIcon className="size-3.5" aria-hidden="true" />
              Locked until {formatDate(user.lockedUntil)}
            </Badge>
          )}
          {user.mustChangePassword && <Badge tone="neutral">Must change password</Badge>}
        </span>
      }
      actions={<UserRowActions user={user} context={context} onAction={runAction} />}
    >
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <Card title="Details">
          <dl className="grid gap-3">
            {details.map((detail) => (
              <div key={detail.label} className="grid grid-cols-[10rem_1fr] gap-3 text-sm">
                <dt className="text-ink-muted">{detail.label}</dt>
                <dd className="font-medium wrap-anywhere text-ink">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card
          title="Signed-in devices"
          description="Use “Sign out all devices” from the actions menu to end all of them at once."
        >
          <SessionList
            sessions={sessions.data ?? []}
            isLoading={sessions.isPending}
            emptyMessage={`${user.fullName} isn’t signed in on any device right now.`}
          />
        </Card>
        <AccountHistoryCard
          events={history.data ?? []}
          isLoading={history.isPending}
          personName={user.fullName}
        />
      </div>

      {dialogs}
    </PageContainer>
  )
}
