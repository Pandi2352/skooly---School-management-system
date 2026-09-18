import {
  ArchiveIcon,
  DotsThreeVerticalIcon,
  EnvelopeSimpleIcon,
  KeyIcon,
  PencilSimpleIcon,
  PlayIcon,
  ProhibitIcon,
  SignOutIcon,
  UserSwitchIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import type { User } from '../types/user.types'
import {
  canArchive,
  canChangeRole,
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
  const entries: MenuEntry[] = [
    { action: 'edit', label: 'Edit details', icon: PencilSimpleIcon, check: canEditDetails(user) },
    { action: 'change-role', label: 'Change role', icon: UserSwitchIcon, check: canChangeRole(user, context) },
    {
      action: 'resend-invitation',
      label: 'Send invitation again',
      icon: EnvelopeSimpleIcon,
      check: canResendInvitation(user),
    },
    { action: 'send-reset', label: 'Email a password reset', icon: EnvelopeSimpleIcon, check: canSendPasswordReset(user) },
    { action: 'temporary-password', label: 'Set a temporary password', icon: KeyIcon, check: canSetTemporaryPassword(user) },
    { action: 'sign-out-devices', label: 'Sign out all devices', icon: SignOutIcon, check: canEditDetails(user) },
  ]

  const statusEntry: MenuEntry =
    user.status === 'active'
      ? { action: 'suspend', label: 'Suspend account', icon: ProhibitIcon, check: canSuspend(user, context), tone: 'danger' }
      : { action: 'activate', label: 'Switch account back on', icon: PlayIcon, check: canReactivate(user) }

  const archiveEntry: MenuEntry = {
    action: 'archive',
    label: 'Archive account',
    icon: ArchiveIcon,
    check: canArchive(user, context),
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
