import { GearSixIcon } from '@phosphor-icons/react'
import { paths } from '@/app/paths'
import { cn } from '@/lib/cn'
import { SidebarItem } from './SidebarItem'

type SidebarFooterProps = {
  collapsed: boolean
  onNavigate: () => void
}

export function SidebarFooter({ collapsed, onNavigate }: SidebarFooterProps) {
  return (
    <div className={cn('flex-none border-t border-side-line py-2', collapsed ? 'px-0' : 'px-2')}>
      {/* TODO(auth): account section (initials, name, role, school, logout) once login exists (FRONTEND.md D2). */}
      <SidebarItem
        to={paths.settingsGeneral}
        label="Settings"
        icon={GearSixIcon}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
    </div>
  )
}
