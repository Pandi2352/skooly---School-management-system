import type { Icon } from '@phosphor-icons/react'
import { NavLink, useMatch } from 'react-router-dom'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/cn'
import { sidebarIcon, sidebarRow, sidebarRowLabel } from './sidebarStyles'

type SidebarItemProps = {
  to: string
  label: string
  icon: Icon
  collapsed: boolean
  onNavigate: () => void
}

/** A top-level link row. When collapsed, the label moves into a tooltip. */
export function SidebarItem({
  to,
  label,
  icon: ItemIcon,
  collapsed,
  onNavigate,
}: SidebarItemProps) {
  // Active state comes from useMatch, not NavLink's className function: the tooltip trigger
  // merges className as a string, which silently dropped the function and every row style.
  const isActive = useMatch({ path: to, end: false }) !== null

  return (
    <Tooltip content={label} side="right" disabled={!collapsed}>
      <NavLink
        to={to}
        onClick={onNavigate}
        className={sidebarRow(
          collapsed,
          cn('hover:bg-side-hover', isActive && 'font-semibold text-accent'),
        )}
      >
        <ItemIcon
          weight={isActive ? 'fill' : 'regular'}
          className={sidebarIcon(isActive)}
          aria-hidden="true"
        />
        <span className={sidebarRowLabel(collapsed)}>{label}</span>
      </NavLink>
    </Tooltip>
  )
}
