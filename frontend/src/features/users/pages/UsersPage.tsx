import { PlusIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { EmptyState } from '@/components/page/EmptyState'
import { PageContainer } from '@/components/page/PageContainer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { useSession } from '@/features/auth/hooks/useSession'
import { useRoles } from '@/features/roles/hooks/useRoles'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { formatNumber } from '@/lib/format'
import { UserCountBadges } from '../components/UserCountBadges'
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
  const context = {
    currentUserId: session.data?.user.id ?? '',
    administratorCount: meta?.administrators ?? 0,
  }

  return (
    <PageContainer
      title="User Accounts"
      description="Who can sign in to your school’s system, and what each person is allowed to do."
      status={
        meta && (
          <ul aria-label="Account totals" className="flex flex-wrap gap-1.5">
            <UserCountBadges meta={meta} />
          </ul>
        )
      }
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
      <div className="grid min-w-0 grid-cols-1 gap-5">
        {/* Controls sit on a surface card: their borders don't reach 3:1 against the page background. */}
        <section
          aria-labelledby="user-accounts-heading"
          className="min-w-0 rounded-md border border-line bg-surface"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2
                id="user-accounts-heading"
                className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink"
              >
                <UsersThreeIcon className="size-5 text-primary" aria-hidden="true" />
                Staff accounts
              </h2>
              {meta && (
                <Badge tone="neutral">
                  {formatNumber(meta.total)} {isFiltered ? 'matching' : 'in total'}
                </Badge>
              )}
            </div>
          </div>

          <UsersToolbar
            query={query}
            roles={roles.data ?? []}
            isFiltered={isFiltered}
            onChange={update}
            onReset={reset}
          />

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

          {meta && meta.total > meta.limit && (
            <div className="border-t border-line px-4 py-2.5">
              <Pagination
                page={meta.page}
                pageCount={meta.totalPages}
                total={meta.total}
                pageSize={meta.limit}
                itemLabel="accounts"
                onPageChange={(page) => update({ page })}
              />
            </div>
          )}
        </section>
      </div>

      {dialogs}
    </PageContainer>
  )
}
