import { PlusIcon, UsersIcon } from '@phosphor-icons/react'
import { EmptyState } from '@/components/page/EmptyState'
import { PageContainer } from '@/components/page/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Pagination } from '@/components/ui/Pagination'
import { useSession } from '@/features/auth/hooks/useSession'
import { useRoles } from '@/features/roles/hooks/useRoles'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { UserCountsBar } from '../components/UserCountsBar'
import { UsersTable } from '../components/UsersTable'
import { UsersToolbar } from '../components/UsersToolbar'
import { useAccountActions } from '../hooks/useAccountActions'
import { useUserFilters } from '../hooks/useUserFilters'
import { useUsers } from '../hooks/useUsers'

/** Who can sign in to this school, with which role, and what to do when someone can't get in. */
export function UsersPage() {
  const { query, update, reset, isFiltered } = useUserFilters()
  const users = useUsers(query)
  const roles = useRoles()
  const session = useSession()
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
      actions={
        <Button onClick={openAddForm}>
          <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
          Add account
        </Button>
      }
      fullWidth
    >
      <div className="grid gap-5">
        {meta && (
          <UserCountsBar meta={meta} status={query.status} onSelect={(status) => update({ status })} />
        )}

        <Card>
          <div className="grid gap-4">
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
              error={users.isError ? getErrorMessage(users.error) : undefined}
              onRetry={() => void users.refetch()}
              context={context}
              onAction={runAction}
              empty={
                isFiltered ? (
                  <EmptyState
                    icon={UsersIcon}
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
                    icon={UsersIcon}
                    title="No accounts yet"
                    description="Add the colleagues who need to sign in. Each one gets a role that decides what they can do."
                    action={<Button onClick={openAddForm}>Add the first account</Button>}
                  />
                )
              }
            />

            {meta && meta.total > meta.limit && (
              <Pagination
                page={meta.page}
                pageCount={meta.totalPages}
                total={meta.total}
                pageSize={meta.limit}
                itemLabel="accounts"
                onPageChange={(page) => update({ page })}
              />
            )}
          </div>
        </Card>
      </div>

      {dialogs}
    </PageContainer>
  )
}
