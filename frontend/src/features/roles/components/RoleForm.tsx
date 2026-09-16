import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useCreateRole, useUpdateRoleDetails } from '../hooks/useRoles'
import { roleFormSchema } from '../schemas/role.schema'
import type { Role, RoleFormValues } from '../types/role.types'
import { isRoleNameTaken } from '../utils/permissions'

type RoleFormProps = {
  /** The role whose details are edited, or null to add a role. */
  role: Role | null
  roles: Role[]
  /** Receives the saved role, or null when cancelled. */
  onDone: (saved: Role | null) => void
}

export function RoleForm({ role, roles, onDone }: RoleFormProps) {
  const { toast } = useToast()
  const createRole = useCreateRole()
  const updateDetails = useUpdateRoleDetails()
  const isSystem = role?.kind === 'system'
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: { name: role?.name ?? '', description: role?.description ?? '', copyFromRoleId: 'none' },
  })

  const copyOptions = [
    { value: 'none', label: 'Start with no permissions' },
    ...roles.map((item) => ({ value: item.id, label: `Copy from ${item.name}` })),
  ]

  const submit = handleSubmit(async (values) => {
    if (isRoleNameTaken(roles, values.name, role?.id)) {
      setError('name', { message: 'Another role already has this name' }, { shouldFocus: true })
      return
    }
    try {
      const saved = role
        ? await updateDetails.mutateAsync({ id: role.id, details: { name: values.name, description: values.description } })
        : await createRole.mutateAsync({
            name: values.name,
            description: values.description,
            copyFromRoleId: values.copyFromRoleId === 'none' ? null : values.copyFromRoleId,
          })
      toast({
        title: role ? 'Role updated' : 'Role added',
        description: `${saved.name}. Sample data: it resets when the page reloads.`,
      })
      onDone(saved)
    } catch (error) {
      toast({ tone: 'error', title: 'Couldn’t save the role', description: getErrorMessage(error) })
    }
  })

  return (
    <form noValidate aria-label={role ? 'Edit role details' : 'Add role'} onSubmit={(event) => void submit(event)}>
      <div className="grid gap-4">
        <Input
          label="Role Name"
          required
          autoComplete="off"
          placeholder="e.g. Transport Manager"
          readOnly={isSystem}
          className={isSystem ? 'bg-canvas text-ink-muted' : undefined}
          hint={isSystem ? 'System role names can’t be changed.' : undefined}
          error={errors.name?.message}
          {...register('name')}
        />
        <Textarea
          label="Description"
          rows={3}
          placeholder="What people with this role do, e.g. Manages bus routes and drivers"
          error={errors.description?.message}
          {...register('description')}
        />
        {!role && (
          <Controller
            control={control}
            name="copyFromRoleId"
            render={({ field }) => (
              <Select
                label="Starting Permissions"
                hint="You can change every permission after the role is added."
                options={copyOptions}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        )}
      </div>

      <div className="-mx-5 mt-5 -mb-5 flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">
        <Button variant="secondary" disabled={isSubmitting} onClick={() => onDone(null)}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {role ? 'Save details' : 'Add role'}
        </Button>
      </div>
    </form>
  )
}
