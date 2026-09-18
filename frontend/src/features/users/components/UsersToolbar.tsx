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

/** Search and filters for the account list. Every change goes into the URL, so a link shares them. */
export function UsersToolbar({ query, roles, isFiltered, onChange, onReset }: UsersToolbarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-56 flex-1">
        <SearchInput
          label="Search accounts by name or email"
          placeholder="Search name or email"
          value={query.search}
          onValueChange={(search) => onChange({ search })}
        />
      </div>

      <Select
        label="Status"
        size="sm"
        value={query.status}
        onValueChange={(status) => onChange({ status: status as UserListQuery['status'] })}
        options={[
          { value: 'all', label: 'All statuses' },
          ...USER_STATUSES.map((status) => ({ value: status, label: USER_STATUS_LABELS[status] })),
        ]}
      />

      <Select
        label="Role"
        size="sm"
        value={query.roleId}
        onValueChange={(roleId) => onChange({ roleId })}
        options={[
          { value: 'all', label: 'All roles' },
          ...roles.map((role) => ({ value: role.id, label: role.name })),
        ]}
      />

      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
