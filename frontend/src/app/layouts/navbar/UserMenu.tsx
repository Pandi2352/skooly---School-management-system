import { GearSixIcon, SignOutIcon, UserCircleIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/useToast'

export function UserMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSignOut = () => {
    toast({
      title: 'Signed out successfully',
      description: 'You have been logged out of your administrator session.',
    })
    void navigate(paths.login)
  }

  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          className="flex items-center rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-11 pointer-coarse:min-w-11"
          aria-label="User account: School Administrator"
        >
          <Tooltip content="School Administrator (SA)">
            <span className="text-white flex size-8 items-center justify-center rounded-full bg-accent text-xs font-bold shadow-sm ring-2 ring-surface select-none">
              SA
            </span>
          </Tooltip>
        </button>
      }
    >
      <div className="flex flex-col gap-1 px-3 py-2 text-left">
        <span className="text-sm font-semibold text-ink">Principal Sharma</span>
        <span className="text-xs text-ink-muted">admin@skooly.edu</span>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-sm bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
            School Administrator
          </span>
          <span className="text-[10px] text-ink-muted">Central Campus</span>
        </div>
      </div>
      <DropdownSeparator />
      <DropdownItem
        icon={UserCircleIcon}
        onSelect={() => {
          void navigate(paths.settings)
        }}
      >
        <span>My Profile</span>
      </DropdownItem>
      <DropdownItem
        icon={GearSixIcon}
        onSelect={() => {
          void navigate(paths.settingsGeneral)
        }}
      >
        <span>System Preferences</span>
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={SignOutIcon} tone="danger" onSelect={handleSignOut}>
        <span>Sign Out</span>
      </DropdownItem>
    </Dropdown>
  )
}
