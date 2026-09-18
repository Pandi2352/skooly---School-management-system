import { useState, type ReactNode } from 'react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Dialog } from '@/components/ui/Dialog'
import type { Role } from '@/features/roles/types/role.types'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { ChangeRoleDialog } from '../components/ChangeRoleDialog'
import { CredentialHandoverDialog, type Handover } from '../components/CredentialHandoverDialog'
import { UserForm } from '../components/UserForm'
import type { UserAction } from '../components/UserRowActions'
import type { CreatedUser, User } from '../types/user.types'
import {
  useArchiveUser,
  useChangeUserStatus,
  useDisableUserTwoFactor,
  useResendInvitation,
  useRevokeUserSessions,
  useSendPasswordReset,
  useSetTemporaryPassword,
} from './useUsers'

type Confirmation = { action: 'suspend' | 'archive' | 'sign-out-devices' | 'disable-two-factor'; user: User }

const SHARE_WARNING =
  'Anyone who opens this link can set the password for that account, so share it with that person only.'

/**
 * Every action on an account, with its dialogs, in one place: the list and the detail page offer
 * the same actions, and one copy of the wording keeps them from drifting apart.
 *
 * Returns `dialogs` for the page to render, so the pages stay composition only.
 */
export function useAccountActions(roles: Role[]): {
  runAction: (action: UserAction, user: User) => void
  openAddForm: () => void
  dialogs: ReactNode
} {
  const { toast } = useToast()
  const [formUser, setFormUser] = useState<User | 'new' | null>(null)
  const [roleDialogUser, setRoleDialogUser] = useState<User | null>(null)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [handover, setHandover] = useState<Handover | null>(null)

  const resendInvitation = useResendInvitation()
  const sendPasswordReset = useSendPasswordReset()
  const setTemporaryPassword = useSetTemporaryPassword()
  const changeStatus = useChangeUserStatus()
  const archiveUser = useArchiveUser()
  const revokeSessions = useRevokeUserSessions()
  const disableTwoFactor = useDisableUserTwoFactor()

  const showCreated = (created: CreatedUser) => {
    if (created.temporaryPassword) {
      setHandover({
        title: `Temporary password for ${created.user.fullName}`,
        description: 'Read it out or write it down. They must choose their own at the first sign-in.',
        secretLabel: 'Temporary password',
        secretValue: created.temporaryPassword,
        note: 'Only a hash of it is stored, so it can’t be shown again.',
      })
    } else if (created.invitationEmailSent) {
      toast.success('Invitation sent', `${created.user.email} can now set their password.`)
    } else if (created.invitationLink) {
      setHandover({
        title: 'Account created, but the email didn’t send',
        description: `Send this link to ${created.user.email} so they can set their password.`,
        secretLabel: 'Invitation link',
        secretValue: created.invitationLink,
        note: SHARE_WARNING,
      })
    }
  }

  const perform = async (action: UserAction, user: User) => {
    try {
      switch (action) {
        case 'edit':
          setFormUser(user)
          break
        case 'change-role':
          setRoleDialogUser(user)
          break
        case 'resend-invitation': {
          const result = await resendInvitation.mutateAsync(user.id)
          if (result.emailSent) {
            toast.success('Invitation sent', `A new link is on its way to ${result.user.email}.`)
          } else if (result.link) {
            setHandover({
              title: 'Email couldn’t be sent',
              description: `Send this link to ${result.user.email} yourself so they can set their password.`,
              secretLabel: 'Invitation link',
              secretValue: result.link,
              note: SHARE_WARNING,
            })
          }
          break
        }
        case 'send-reset': {
          const result = await sendPasswordReset.mutateAsync(user.id)
          if (result.emailSent) {
            toast.success('Reset link sent', `${result.user.email} can now choose a new password.`)
          } else if (result.link) {
            setHandover({
              title: 'Email couldn’t be sent',
              description: `Send this reset link to ${result.user.email} yourself.`,
              secretLabel: 'Password reset link',
              secretValue: result.link,
              note: SHARE_WARNING,
            })
          }
          break
        }
        case 'temporary-password': {
          const result = await setTemporaryPassword.mutateAsync({ id: user.id })
          setHandover({
            title: `Temporary password for ${result.user.fullName}`,
            description: 'Read it out or write it down. They will choose their own at the next sign-in.',
            secretLabel: 'Temporary password',
            secretValue: result.temporaryPassword,
            note:
              result.sessionsEnded > 0
                ? `Only a hash of it is stored, so it can’t be shown again. ${result.sessionsEnded} signed-in ${result.sessionsEnded === 1 ? 'device was' : 'devices were'} signed out.`
                : 'Only a hash of it is stored, so it can’t be shown again.',
          })
          break
        }
        case 'activate': {
          const updated = await changeStatus.mutateAsync({ id: user.id, status: 'active' })
          toast.success(
            'Account switched back on',
            updated.status === 'invited'
              ? `${updated.fullName} never set a password, so a fresh invitation was sent.`
              : `${updated.fullName} can sign in again.`,
          )
          break
        }
        case 'suspend':
        case 'archive':
        case 'sign-out-devices':
        case 'disable-two-factor':
          setConfirmation({ action, user })
          break
      }
    } catch (error) {
      toast.error('That didn’t work', getErrorMessage(error))
    }
  }

  const confirm = async () => {
    if (!confirmation) return
    const { action, user } = confirmation
    try {
      if (action === 'suspend') {
        await changeStatus.mutateAsync({ id: user.id, status: 'suspended' })
        toast.success('Account suspended', `${user.fullName} was signed out and can’t sign in.`)
      } else if (action === 'archive') {
        await archiveUser.mutateAsync(user.id)
        toast.success('Account archived', `${user.fullName} is kept on past records but can’t sign in.`)
      } else if (action === 'disable-two-factor') {
        await disableTwoFactor.mutateAsync(user.id)
        toast.success(
          'Two-step sign-in switched off',
          `${user.fullName} signs in with their password alone, and can set it up again themselves.`,
        )
      } else {
        const ended = await revokeSessions.mutateAsync(user.id)
        toast.success(
          'Devices signed out',
          ended === 0
            ? `${user.fullName} wasn’t signed in anywhere.`
            : `${ended} ${ended === 1 ? 'device' : 'devices'} signed out.`,
        )
      }
    } catch (error) {
      toast.error('That didn’t work', getErrorMessage(error))
    } finally {
      setConfirmation(null)
    }
  }

  const confirmCopy = {
    suspend: {
      title: `Suspend ${confirmation?.user.fullName ?? ''}?`,
      description:
        'They are signed out straight away and can’t sign in. You can switch the account back on at any time.',
      confirmLabel: 'Suspend',
      tone: 'danger' as const,
    },
    archive: {
      title: `Archive ${confirmation?.user.fullName ?? ''}?`,
      description:
        'The account stops signing in and keeps everything it created, so old records still say who made them. Its email address stays taken.',
      confirmLabel: 'Archive',
      tone: 'danger' as const,
    },
    'sign-out-devices': {
      title: `Sign ${confirmation?.user.fullName ?? ''} out of every device?`,
      description: 'Their password keeps working; only the devices they are signed in on are signed out.',
      confirmLabel: 'Sign out',
      tone: 'primary' as const,
    },
    'disable-two-factor': {
      title: `Turn off two-step sign-in for ${confirmation?.user.fullName ?? ''}?`,
      description:
        'For someone locked out of their authenticator app. Their password alone will get in again, their sessions end, and they can set it up afresh. Check who you are talking to first.',
      confirmLabel: 'Turn off',
      tone: 'danger' as const,
    },
  }[confirmation?.action ?? 'suspend']

  const dialogs = (
    <>
      <Dialog
        open={formUser !== null}
        onOpenChange={(open) => {
          if (!open) setFormUser(null)
        }}
        title={formUser && formUser !== 'new' ? `Edit ${formUser.fullName}` : 'Add an account'}
      >
        {formUser !== null && (
          <UserForm
            user={formUser === 'new' ? null : formUser}
            roles={roles}
            onCancel={() => setFormUser(null)}
            onDone={(created) => {
              setFormUser(null)
              if (created) showCreated(created)
            }}
          />
        )}
      </Dialog>

      <ChangeRoleDialog user={roleDialogUser} roles={roles} onClose={() => setRoleDialogUser(null)} />

      <CredentialHandoverDialog handover={handover} onClose={() => setHandover(null)} />

      <ConfirmDialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null)
        }}
        title={confirmCopy.title}
        description={confirmCopy.description}
        confirmLabel={confirmCopy.confirmLabel}
        tone={confirmCopy.tone}
        onConfirm={confirm}
      />
    </>
  )

  return {
    runAction: (action, user) => void perform(action, user),
    openAddForm: () => setFormUser('new'),
    dialogs,
  }
}
