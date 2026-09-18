import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { ApiError } from '@/lib/api/ApiError'
import type { Role } from '@/features/roles/types/role.types'
import { useCreateUser, useUpdateUser } from '../hooks/useUsers'
import { userFormSchema } from '../schemas/user.schema'
import type { CreatedUser, User, UserFormValues } from '../types/user.types'
import { generateReadablePassword } from '../utils/generatePassword'

type UserFormProps = {
  /** The account being edited, or null to add one. */
  user: User | null
  roles: Role[]
  /** Receives what the administrator now has to hand over, or null when cancelled. */
  onDone: (created: CreatedUser | null) => void
  onCancel: () => void
}

/**
 * Adding an account asks one question the person filling it in actually has to answer: how does
 * this colleague get in? An emailed link if they have a mailbox, a password read out if they are
 * standing at the desk. Editing only touches contact details; role and status have their own actions.
 */
export function UserForm({ user, roles, onDone, onCancel }: UserFormProps) {
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const { toast } = useToast()
  const isEditing = user !== null

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      // Adding asks for a role and how the person gets in; editing asks neither.
      mode: isEditing ? 'edit' : 'create',
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      designation: user?.designation ?? '',
      roleId: user?.role?.id ?? '',
      handover: 'invitation',
      temporaryPassword: '',
    },
  })

  // useWatch subscribes to the one field; watch() returns a function React Compiler can't memoise.
  const handover = useWatch({ control, name: 'handover' })

  const submit = handleSubmit(async (values) => {
    try {
      if (isEditing) {
        await updateUser.mutateAsync({
          id: user.id,
          changes: {
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            designation: values.designation,
          },
        })
        toast.success('Account updated', `${values.fullName}’s details have been saved.`)
        onDone(null)
        return
      }

      const created = await createUser.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || undefined,
        designation: values.designation || undefined,
        roleId: values.roleId,
        sendInvitation: values.handover === 'invitation',
        temporaryPassword: values.handover === 'temporary-password' ? values.temporaryPassword : undefined,
      })
      onDone(created)
    } catch (error) {
      // The server checks the same things again; show its answer on the field it belongs to.
      if (error instanceof ApiError) {
        const fieldError = error.fieldErrors[0]
        if (fieldError?.field === 'email' || error.errorCode?.includes('EMAIL')) {
          setError('email', { message: error.messages[0] }, { shouldFocus: true })
          return
        }
        if (fieldError?.field === 'roleId') {
          setError('roleId', { message: fieldError.message }, { shouldFocus: true })
          return
        }
      }
      setError('fullName', { message: getErrorMessage(error) }, { shouldFocus: true })
    }
  })

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-4" noValidate>
      <Input
        label="Full name"
        placeholder="e.g. Asha Menon"
        autoFocus
        required
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="e.g. asha.menon@yourschool.in"
        hint="They sign in with this address, and links are sent to it."
        required
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Phone"
          placeholder="e.g. +91 98765 43210"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Designation"
          placeholder="e.g. Vice Principal"
          error={errors.designation?.message}
          {...register('designation')}
        />
      </div>

      {!isEditing && (
        <>
          <Controller
            control={control}
            name="roleId"
            render={({ field }) => (
              <Select
                label="Role"
                placeholder="Choose what this person can do"
                required
                value={field.value}
                onValueChange={field.onChange}
                error={errors.roleId?.message}
                options={roles.map((role) => ({
                  value: role.id,
                  label: role.fullAccess ? `${role.name} (full access)` : role.name,
                }))}
                hint="The role decides which pages and actions they get. It can be changed later."
              />
            )}
          />

          <Controller
            control={control}
            name="handover"
            render={({ field }) => (
              <RadioGroup
                label="How do they get in?"
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  {
                    value: 'invitation',
                    label: 'Email them an invitation link',
                    description: 'They choose their own password. The link works for a few days.',
                  },
                  {
                    value: 'temporary-password',
                    label: 'Set a temporary password',
                    description: 'For someone at the desk, or when email isn’t working. They must change it at first sign-in.',
                  },
                ]}
              />
            )}
          />

          {handover === 'temporary-password' && (
            <Input
              label="Temporary password"
              placeholder="At least 10 characters"
              hint="Read it out or write it down; it is shown here only while you add the account."
              error={errors.temporaryPassword?.message}
              endAddon={
                <button
                  type="button"
                  onClick={() => setValue('temporaryPassword', generateReadablePassword(), { shouldValidate: true })}
                  className="flex items-center gap-1.5 rounded-e-md border border-s-0 border-field bg-canvas px-3 text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-primary pointer-coarse:min-w-11"
                >
                  <ArrowsClockwiseIcon className="size-4" aria-hidden="true" />
                  Generate
                </button>
              }
              {...register('temporaryPassword')}
            />
          )}
        </>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Save changes' : 'Add account'}
        </Button>
      </div>
    </form>
  )
}
