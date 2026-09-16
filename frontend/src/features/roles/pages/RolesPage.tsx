import { PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { PageContainer } from '@/components/page/PageContainer'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { RoleForm } from '../components/RoleForm'
import { RolesGuideDialog } from '../components/RolesGuideDialog'
import { RolesWorkspace } from '../components/RolesWorkspace'
import { useRoles } from '../hooks/useRoles'
import { useSelectedRole } from '../hooks/useSelectedRole'
import type { Role } from '../types/role.types'

type RoleDialog = { mode: 'add' } | { mode: 'edit'; role: Role } | null

export function RolesPage() {
  const roles = useRoles()
  const { setRoleId } = useSelectedRole()
  const [dialog, setDialog] = useState<RoleDialog>(null)

  return (
    <PageContainer
      title="Roles & Permissions"
      description="Choose what each staff role can see and change."
      actions={
        <>
          <RolesGuideDialog />
          <Button onClick={() => setDialog({ mode: 'add' })}>
            <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
            Add Role
          </Button>
        </>
      }
      fullWidth
    >
      <RolesWorkspace onEditDetails={(role) => setDialog({ mode: 'edit', role })} />

      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        title={dialog?.mode === 'edit' ? `Edit ${dialog.role.name}` : 'Add role'}
      >
        {dialog !== null && (
          <RoleForm
            role={dialog.mode === 'edit' ? dialog.role : null}
            roles={roles.data ?? []}
            onDone={(saved) => {
              setDialog(null)
              if (saved) setRoleId(saved.id)
            }}
          />
        )}
      </Dialog>
    </PageContainer>
  )
}
