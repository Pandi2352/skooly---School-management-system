import {
  ArchiveIcon,
  DotsThreeVerticalIcon,
  EnvelopeSimpleIcon,
  KeyIcon,
  PencilSimpleIcon,
  PlayIcon,
  ProhibitIcon,
  ShieldSlashIcon,
  SignOutIcon,
  UserSwitchIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { IconButton } from '@/components/ui/IconButton'
import { USER_PERMISSIONS } from '../constants'
import type { User } from '../types/user.types'
import {
  canArchive,
  canChangeRole,
  canDisableTwoFactor,
  canEditDetails,
  canReactivate,
  canResendInvitation,
  canSendPasswordReset,
  canSetTemporaryPassword,
  canSuspend,
  type AccountContext,
  type ActionCheck,
} from '../utils/userRules'

export type UserAction =
  | 'edit'
  | 'change-role'
  | 'resend-invitation'
  | 'send-reset'
  | 'temporary-password'
  | 'suspend'
  | 'activate'
  | 'sign-out-devices'
  | 'disable-two-factor'
  | 'archive'

type UserRowActionsProps = {
  user: User
  context: AccountContext
  onAction: (action: UserAction, user: User) => void
}

type MenuEntry = { action: UserAction; label: string; icon: Icon; check: ActionCheck; tone?: 'danger' }

/**
 * Every action an administrator can take on one account. Actions a rule forbids stay visible but
 * disabled with the reason, so "why can't I suspend this person?" is answered where it is asked.
 */
export function UserRowActions({ user, context, onAction }: UserRowActionsProps) {
  const { can } = usePermissions()
  const mayEdit = can(USER_PERMISSIONS.edit)
  const mayArchive = can(USER_PERMISSIONS.delete)

  // Someone with view-only access sees the account but is offered nothing to change.
  const editing = (check: ActionCheck): ActionCheck =>
    mayEdit ? check : { allowed: false, reason: 'Your role can view accounts but not change them.' }

  const entries: MenuEntry[] = [
    { action: 'edit', label: 'Edit details', icon: PencilSimpleIcon, check: editing(canEditDetails(user)) },
    { action: 'change-role', label: 'Change role', icon: UserSwitchIcon, check: editing(canChangeRole(user, context)) },
    {
      action: 'resend-invitation',
      label: 'Send invitation again',
      icon: EnvelopeSimpleIcon,
      check: editing(canResendInvitation(user)),
    },
    { action: 'send-reset', label: 'Email a password reset', icon: EnvelopeSimpleIcon, check: editing(canSendPasswordReset(user)) },
    { action: 'temporary-password', label: 'Set a temporary password', icon: KeyIcon, check: editing(canSetTemporaryPassword(user)) },
    { action: 'sign-out-devices', label: 'Sign out all devices', icon: SignOutIcon, check: editing(canEditDetails(user)) },
    {
      action: 'disable-two-factor',
      label: 'Turn off two-step sign-in',
      icon: ShieldSlashIcon,
      check: editing(canDisableTwoFactor(user)),
    },
  ]

  const statusEntry: MenuEntry =
    user.status === 'active'
      ? { action: 'suspend', label: 'Suspend account', icon: ProhibitIcon, check: editing(canSuspend(user, context)), tone: 'danger' }
      : { action: 'activate', label: 'Switch account back on', icon: PlayIcon, check: editing(canReactivate(user)) }

  const archiveEntry: MenuEntry = {
    action: 'archive',
    label: 'Archive account',
    icon: ArchiveIcon,
    check: mayArchive
      ? canArchive(user, context)
      : { allowed: false, reason: 'Your role can’t archive accounts.' },
    tone: 'danger',
  }

  return (
    <Dropdown
      trigger={
        <IconButton label={`Actions for ${user.fullName}`} icon={DotsThreeVerticalIcon} size="sm" />
      }
    >
      {entries.map((entry) => (
        <MenuAction key={entry.action} entry={entry} onSelect={() => onAction(entry.action, user)} />
      ))}
      <DropdownSeparator />
      <MenuAction entry={statusEntry} onSelect={() => onAction(statusEntry.action, user)} />
      <MenuAction entry={archiveEntry} onSelect={() => onAction('archive', user)} />
    </Dropdown>
  )
}

function MenuAction({ entry, onSelect }: { entry: MenuEntry; onSelect: () => void }) {
  return (
    <DropdownItem
      icon={entry.icon}
      tone={entry.tone}
      disabled={!entry.check.allowed}
      onSelect={entry.check.allowed ? onSelect : undefined}
    >
      <span className="grid">
        <span>{entry.label}</span>
        {!entry.check.allowed && (
          <span className="text-xs font-normal text-ink-muted">{entry.check.reason}</span>
        )}
      </span>
    </DropdownItem>
  )
}
