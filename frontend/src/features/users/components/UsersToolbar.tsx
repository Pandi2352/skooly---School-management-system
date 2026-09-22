import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import type { Role } from '@/features/roles/types/role.types'
import type { UserListQuery } from '../api/users'
import { USER_STATUSES, USER_STATUS_LABELS } from '../constants'

type UsersToolbarProps = {
  query: UserListQuery
  roles: Role[]
  isFiltered: boolean
  onChange: (changes: Partial<UserListQuery>) => void
  onReset: () => void
}

/**
 * Filters on the left, search on the right, matching the student list's toolbar. Every change goes
 * into the URL, so a filtered list can be shared as a link or survive a reload.
 */
export function UsersToolbar({ query, roles, isFiltered, onChange, onReset }: UsersToolbarProps) {
  return (
    <>
      <div className="w-full sm:w-64">
        <SearchInput
          label="Search accounts by name or email"
          size="sm"
          placeholder="Search name or email"
          value={query.search}
          onValueChange={(search) => onChange({ search })}
        />
      </div>

      <div className="w-40">
        <Select
          label="Status"
          hideLabel
          size="sm"
          value={query.status}
          onValueChange={(status) => onChange({ status: status as UserListQuery['status'] })}
          options={[
            { value: 'all', label: 'All statuses' },
            ...USER_STATUSES.map((status) => ({ value: status, label: USER_STATUS_LABELS[status] })),
          ]}
        />
      </div>

      <div className="w-44">
        <Select
          label="Role"
          hideLabel
          size="sm"
          value={query.roleId}
          onValueChange={(roleId) => onChange({ roleId })}
          options={[
            { value: 'all', label: 'All roles' },
            ...roles.map((role) => ({ value: role.id, label: role.name })),
          ]}
        />
      </div>

      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear filters
        </Button>
      )}
    </>
  )
}
