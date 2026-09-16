import { useState } from 'react'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useRoles, useSaveRolePermissions } from '../hooks/useRoles'
import { useSelectedRole } from '../hooks/useSelectedRole'
import type { Role } from '../types/role.types'
import { samePermissions } from '../utils/permissions'
import { RoleList } from './RoleList'
import { RolePermissionsEditor } from './RolePermissionsEditor'

type Draft = { roleId: string; permissions: string[] }

/**
 * Role list and permission editor. Changes stay a draft until saved; switching roles with unsaved
 * changes asks first.
 */
export function RolesWorkspace({ onEditDetails }: { onEditDetails: (role: Role) => void }) {
  const roles = useRoles()
  const savePermissions = useSaveRolePermissions()
  const { roleId, setRoleId } = useSelectedRole()
  const { toast } = useToast()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [pendingRoleId, setPendingRoleId] = useState<string | null>(null)

  if (roles.isPending) return <LoadingState label="Loading roles" />
  if (roles.isError) {
    return (
      <ErrorState
        title="Couldn’t load roles"
        description={getErrorMessage(roles.error)}
        onRetry={() => void roles.refetch()}
      />
    )
  }

  const list = roles.data
  const selected = list.find((role) => role.id === roleId) ?? list[0]
  if (!selected) return <p className="text-ink-muted">No roles yet. Add one to get started.</p>

  const editing = draft?.roleId === selected.id ? draft.permissions : selected.permissions
  const isDirty = draft?.roleId === selected.id && !samePermissions(draft.permissions, selected.permissions)

  const select = (id: string) => {
    if (id === selected.id) return
    if (isDirty) {
      setPendingRoleId(id)
      return
    }
    setDraft(null)
    setRoleId(id)
  }

  const save = async () => {
    try {
      const saved = await savePermissions.mutateAsync({ id: selected.id, permissions: editing })
      setDraft(null)
      toast({
        title: 'Permissions saved',
        description: `${saved.name}. Sample data: changes reset when the page reloads.`,
      })
    } catch (error) {
      toast({ tone: 'error', title: 'Couldn’t save permissions', description: getErrorMessage(error) })
    }
  }

  const pendingRole = list.find((role) => role.id === pendingRoleId)

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="min-w-0 lg:sticky lg:top-[calc(var(--spacing-navbar)+1.25rem)]">
        <RoleList roles={list} selectedId={selected.id} onSelect={select} />
      </aside>

      <RolePermissionsEditor
        key={selected.id}
        role={selected}
        permissions={editing}
        isDirty={isDirty}
        saving={savePermissions.isPending}
        onChange={(permissions) => setDraft({ roleId: selected.id, permissions })}
        onSave={() => void save()}
        onDiscard={() => setDraft(null)}
        onEditDetails={() => onEditDetails(selected)}
        onDeleted={() => {
          setDraft(null)
          setRoleId(null)
        }}
      />

      <ConfirmDialog
        open={pendingRoleId !== null}
        onOpenChange={(open) => {
          if (!open) setPendingRoleId(null)
        }}
        title="Discard unsaved changes?"
        description={`Permission changes to ${selected.name} haven’t been saved.${pendingRole ? ` Open ${pendingRole.name} anyway?` : ''}`}
        confirmLabel="Discard changes"
        onConfirm={() => {
          setDraft(null)
          setRoleId(pendingRoleId)
          setPendingRoleId(null)
        }}
      />
    </div>
  )
}
