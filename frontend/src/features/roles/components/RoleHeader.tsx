import { LockSimpleIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useDeleteRole } from '../hooks/useRoles'
import type { Role } from '../types/role.types'
import { RoleIcon } from './RoleIcon'

type RoleHeaderProps = {
  role: Role
  headingId: string
  onEditDetails: () => void
  onDeleted: () => void
}

export function RoleHeader({ role, headingId, onEditDetails, onDeleted }: RoleHeaderProps) {
  const { toast } = useToast()
  const deleteRole = useDeleteRole()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-4 @xl:px-5">
      <div className="grid min-w-0 gap-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent">
            <RoleIcon roleId={role.id} className="size-4" weight="bold" />
          </span>
          <h2 id={headingId} className="text-lg font-bold text-ink">
            {role.name}
          </h2>
          {role.kind === 'system' ? (
            <Badge tone="info" className="gap-1">
              <LockSimpleIcon className="size-3" weight="fill" aria-hidden="true" />
              System role
            </Badge>
          ) : (
            <Badge>Custom role</Badge>
          )}
          {role.fullAccess && <Badge tone="success">Full access</Badge>}
        </div>
        {role.description !== '' && <p className="max-w-prose text-sm text-ink-muted">{role.description}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onEditDetails}>
          <PencilSimpleIcon className="size-4" aria-hidden="true" />
          Edit details
        </Button>
        {role.kind === 'custom' && (
          <Button variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger" onClick={() => setConfirmOpen(true)}>
            <TrashIcon className="size-4" aria-hidden="true" />
            Delete role
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${role.name}?`}
        description="The role and its permissions are removed. Staff who had this role will need a new one."
        confirmLabel="Delete role"
        onConfirm={async () => {
          try {
            await deleteRole.mutateAsync(role.id)
            toast({ title: 'Role deleted', description: `${role.name}. Sample data: it returns when the page reloads.` })
            onDeleted()
          } catch (error) {
            toast({ tone: 'error', title: 'Couldn’t delete the role', description: getErrorMessage(error) })
          }
        }}
      />
    </div>
  )
}
