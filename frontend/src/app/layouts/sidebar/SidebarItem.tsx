import type { Icon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/cn'
import { sidebarIcon, sidebarRow, sidebarRowLabel } from './sidebarStyles'
import { useIsMenuItemActive } from './useIsMenuItemActive'

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
  // A plain Link, not NavLink: NavLink decides "current" by prefix and would mark this row on any
  // address beneath it. useIsMenuItemActive picks the closest match instead.
  const isActive = useIsMenuItemActive()(to)

  return (
    <Tooltip content={label} side="right" disabled={!collapsed}>
      <Link
        to={to}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
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
      </Link>
    </Tooltip>
  )
}
