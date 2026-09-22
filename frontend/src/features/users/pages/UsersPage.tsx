import {
  ArchiveIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  PlusIcon,
  ProhibitIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import { CountRail, type CountSegment } from '@/components/page/CountRail'
import { EmptyState } from '@/components/page/EmptyState'
import { PageContainer } from '@/components/page/PageContainer'
import { RecordsCard } from '@/components/page/RecordsCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { useSession } from '@/features/auth/hooks/useSession'
import { useRoles } from '@/features/roles/hooks/useRoles'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { formatNumber } from '@/lib/format'
import { UsersTable } from '../components/UsersTable'
import { UsersToolbar } from '../components/UsersToolbar'
import { USER_PERMISSIONS } from '../constants'
import { useAccountActions } from '../hooks/useAccountActions'
import { useUserFilters } from '../hooks/useUserFilters'
import { useUsers } from '../hooks/useUsers'

// The page composes: filters from the URL, data from query hooks, rendering from components.
export function UsersPage() {
  const { query, update, reset, isFiltered } = useUserFilters()
  const users = useUsers(query)
  const roles = useRoles()
  const session = useSession()
  const { can } = usePermissions()
  const mayAdd = can(USER_PERMISSIONS.create)
  const { runAction, openAddForm, dialogs } = useAccountActions(roles.data ?? [])

  const meta = users.data?.meta
  // Counts cover the whole school, not the page, and each one filters the list.
  const segments: CountSegment[] = [
    {
      id: 'active',
      label: 'Active',
      count: meta?.active ?? 0,
      icon: CheckCircleIcon,
      tone: 'success',
      hint: 'Show only accounts that can sign in',
    },
    {
      id: 'invited',
      label: 'Invited',
      count: meta?.invited ?? 0,
      icon: EnvelopeSimpleIcon,
      tone: 'warning',
      hint: 'Show only accounts waiting to set a password',
    },
    {
      id: 'suspended',
      label: 'Suspended',
      count: meta?.suspended ?? 0,
      icon: ProhibitIcon,
      tone: 'danger',
      hideWhenZero: true,
    },
    {
      id: 'archived',
      label: 'Archived',
      count: meta?.archived ?? 0,
      icon: ArchiveIcon,
      hideWhenZero: true,
    },
  ]

  const context = {
    currentUserId: session.data?.user.id ?? '',
    administratorCount: meta?.administrators ?? 0,
  }

  return (
    <PageContainer
      title="User Accounts"
      description="Who can sign in to your school’s system, and what each person is allowed to do."
      actions={
        // Someone with view-only access isn't offered a button the API would refuse.
        mayAdd && (
          <Button onClick={openAddForm}>
            <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
            Add account
          </Button>
        )
      }
      fullWidth
    >
      {/* grid-cols-1 is minmax(0, 1fr): without it the column grows to the table's full width
          and the whole page scrolls sideways instead of the table. */}
      <div className="grid min-w-0 grid-cols-1 gap-4">
        {meta && (
          <CountRail
            label="Account totals"
            segments={segments}
            activeId={query.status}
            onSelect={(status) => update({ status: status as typeof query.status })}
          />
        )}

        <RecordsCard
          title="Staff accounts"
          icon={UsersThreeIcon}
          badges={
            meta && (
              <Badge tone="neutral">
                {formatNumber(meta.total)} {isFiltered ? 'matching' : 'in total'}
              </Badge>
            )
          }
          toolbar={
            <UsersToolbar
              query={query}
              roles={roles.data ?? []}
              isFiltered={isFiltered}
              onChange={update}
              onReset={reset}
            />
          }
          footer={
            meta && meta.total > meta.limit ? (
              <Pagination
                page={meta.page}
                pageCount={meta.totalPages}
                total={meta.total}
                pageSize={meta.limit}
                itemLabel="accounts"
                onPageChange={(page) => update({ page })}
              />
            ) : undefined
          }
        >
          <UsersTable
            users={users.data?.users ?? []}
            isLoading={users.isPending}
            isRefreshing={users.isPlaceholderData}
            error={users.isError ? getErrorMessage(users.error) : undefined}
            onRetry={() => void users.refetch()}
            context={context}
            onAction={runAction}
            empty={
              isFiltered ? (
                <EmptyState
                  icon={UsersThreeIcon}
                  title="No accounts match these filters"
                  description="Try a different search, or clear the filters to see everyone."
                  action={
                    <Button variant="secondary" onClick={reset}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={UsersThreeIcon}
                  title="No accounts yet"
                  description="Add the colleagues who need to sign in. Each one gets a role that decides what they can do."
                  action={mayAdd ? <Button onClick={openAddForm}>Add the first account</Button> : undefined}
                />
              )
            }
          />
        </RecordsCard>
      </div>

      {dialogs}
    </PageContainer>
  )
}
