import { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Select } from '@/components/ui/Select'
import type { Role } from '@/features/roles/types/role.types'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useChangeUserRole } from '../hooks/useUsers'
import type { User } from '../types/user.types'

type ChangeRoleDialogProps = {
  user: User | null
  roles: Role[]
  onClose: () => void
}

/** One role per person. Changing it takes effect on their next request, not their next sign-in. */
export function ChangeRoleDialog({ user, roles, onClose }: ChangeRoleDialogProps) {
  const changeRole = useChangeUserRole()
  const { toast } = useToast()
  const [roleId, setRoleId] = useState('')

  const selectedRole = roles.find((role) => role.id === roleId)
  const currentRoleId = user?.role?.id ?? ''
  const value = roleId || currentRoleId

  const save = async () => {
    if (!user || value === currentRoleId) return
    try {
      const updated = await changeRole.mutateAsync({ id: user.id, roleId: value })
      toast.success('Role changed', `${updated.fullName} is now ${updated.role?.name ?? 'without a role'}.`)
      setRoleId('')
      onClose()
    } catch (error) {
      toast.error('Couldn’t change the role', getErrorMessage(error))
    }
  }

  return (
    <Dialog
      open={user !== null}
      onOpenChange={(open) => {
        if (!open) {
          setRoleId('')
          onClose()
        }
      }}
      title={user ? `Change role for ${user.fullName}` : ''}
      description="The role decides which pages and actions this person gets."
    >
      {user && (
        <div className="grid gap-4">
          <Select
            label="Role"
            value={value}
            onValueChange={setRoleId}
            options={roles.map((role) => ({
              value: role.id,
              label: role.fullAccess ? `${role.name} (full access)` : role.name,
            }))}
            hint={`Currently ${user.role?.name ?? 'without a role'}.`}
          />

          {selectedRole?.fullAccess && selectedRole.id !== currentRoleId && (
            <Alert tone="warning" title="This role can do everything">
              {selectedRole.name} includes every page and action, including managing accounts and
              roles. Give it only to people who run the school’s system.
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => void save()} loading={changeRole.isPending} disabled={value === currentRoleId}>
              Save role
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
