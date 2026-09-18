import { GearSixIcon, KeyIcon, SignOutIcon, UserCircleIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { useLogout, useSession } from '@/features/auth/hooks/useSession'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'

/** The signed-in person, read from the session: never a name written into the code. */
export function UserMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const session = useSession()
  const signOut = useLogout()

  const account = session.data
  if (!account) return null

  const { user, fullAccess } = account
  const roleName = user.role?.name ?? 'No role'

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync()
    } catch (error) {
      // The cookie is cleared by the server; a failure here only means it couldn't be told.
      toast.error('Couldn’t sign out cleanly', getErrorMessage(error))
    }
    void navigate(paths.login, { replace: true })
  }

  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          className="flex items-center rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-11 pointer-coarse:min-w-11"
          aria-label={`Your account: ${user.fullName}, ${roleName}`}
        >
          <Tooltip content={`${user.fullName} · ${roleName}`}>
            <Avatar name={user.fullName} size="sm" className="ring-2 ring-surface" />
          </Tooltip>
        </button>
      }
    >
      <div className="flex flex-col gap-1 px-3 py-2 text-left">
        <span className="text-sm font-semibold wrap-anywhere text-ink">{user.fullName}</span>
        <span className="text-xs wrap-anywhere text-ink-muted">{user.email}</span>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-sm bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
            {roleName}
          </span>
          {fullAccess && <span className="text-[10px] text-ink-muted">Full access</span>}
        </div>
      </div>
      <DropdownSeparator />
      <DropdownItem icon={UserCircleIcon} onSelect={() => void navigate(paths.account)}>
        <span>My account</span>
      </DropdownItem>
      <DropdownItem icon={KeyIcon} onSelect={() => void navigate(paths.accountPassword)}>
        <span>Change password</span>
      </DropdownItem>
      <DropdownItem icon={GearSixIcon} onSelect={() => void navigate(paths.settingsGeneral)}>
        <span>System preferences</span>
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={SignOutIcon} tone="danger" onSelect={() => void handleSignOut()}>
        <span>Sign out</span>
      </DropdownItem>
    </Dropdown>
  )
}
