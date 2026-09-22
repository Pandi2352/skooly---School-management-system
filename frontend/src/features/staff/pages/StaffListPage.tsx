import { PlusIcon, UserPlusIcon, UsersIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { EmptyState } from '@/components/page/EmptyState'
import { PageContainer } from '@/components/page/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Pagination } from '@/components/ui/Pagination'
import { AddStaffDialog } from '../components/AddStaffDialog'
import { StaffFilters } from '../components/StaffFilters'
import { StaffTable } from '../components/StaffTable'
import { useStaff, useStaffStats } from '../hooks/useStaff'
import { useStaffFilters } from '../hooks/useStaffFilters'

export function StaffListPage() {
  const { filters, update, reset, isFiltered } = useStaffFilters()
  const { data, isLoading, isFetching, error, refetch } = useStaff(filters)
  const { data: stats } = useStaffStats()
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const rows = data?.rows ?? []
  const total = data?.total ?? 0
  const pageCount = data?.pageCount ?? 1

  return (
    <PageContainer
      title="Staff Directory"
      description="Manage teaching faculty, administrative officers, and support staff records."
      fullWidth
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setAddDialogOpen(true)}
          >
            <PlusIcon className="size-4" />
            Add Staff Member
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Status quick tabs / metric pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => update({ status: '', page: 1 })}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
              filters.status === ''
                ? 'border-primary bg-primary text-surface'
                : 'border-line bg-surface text-ink-muted hover:border-control hover:text-ink'
            }`}
          >
            <UsersIcon className="size-3.5" />
            <span>All Staff ({stats?.total ?? total})</span>
          </button>

          <button
            type="button"
            onClick={() => update({ status: 'active', page: 1 })}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
              filters.status === 'active'
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-line bg-surface text-ink-muted hover:border-emerald-500 hover:text-emerald-700'
            }`}
          >
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Active ({stats?.active ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => update({ status: 'on-leave', page: 1 })}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
              filters.status === 'on-leave'
                ? 'border-amber-600 bg-amber-600 text-white'
                : 'border-line bg-surface text-ink-muted hover:border-amber-500 hover:text-amber-700'
            }`}
          >
            <span className="size-2 rounded-full bg-amber-500" />
            <span>On Leave ({stats?.onLeave ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => update({ status: 'resigned', page: 1 })}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
              filters.status === 'resigned'
                ? 'border-rose-600 bg-rose-600 text-white'
                : 'border-line bg-surface text-ink-muted hover:border-rose-500 hover:text-rose-700'
            }`}
          >
            <span className="size-2 rounded-full bg-rose-500" />
            <span>Resigned ({stats?.resigned ?? 0})</span>
          </button>
        </div>

        {/* Filters Card */}
        <Card className="p-4">
          <StaffFilters
            filters={filters}
            onUpdate={update}
            onReset={reset}
            isFiltered={isFiltered}
          />
        </Card>

        {/* Staff Table */}
        <StaffTable
          staff={rows}
          isLoading={isLoading}
          isRefreshing={isFetching && !isLoading}
          error={error instanceof Error ? error.message : undefined}
          onRetry={() => void refetch()}
          empty={
            <EmptyState
              title={isFiltered ? 'No matching staff members' : 'No staff members added yet'}
              description={
                isFiltered
                  ? 'Try broadening your search term or clearing one of the filters.'
                  : 'Start by onboarding your first faculty or staff member.'
              }
              action={
                isFiltered ? (
                  <Button variant="ghost" size="sm" onClick={reset}>
                    Clear filters
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setAddDialogOpen(true)}
                  >
                    <UserPlusIcon className="size-4" />
                    Add Staff Member
                  </Button>
                )
              }
            />
          }
        />

        {/* Pagination */}
        {total > 0 && (
          <div className="pt-2">
            <Pagination
              page={filters.page}
              pageCount={pageCount}
              total={total}
              pageSize={filters.limit}
              onPageChange={(page) => update({ page })}
              itemLabel="staff members"
            />
          </div>
        )}
      </div>

      <AddStaffDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </PageContainer>
  )
}
