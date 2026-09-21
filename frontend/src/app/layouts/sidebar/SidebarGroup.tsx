import { CaretRightIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { Tooltip } from '@/components/ui/Tooltip'
import { moduleIcons } from '@/config/moduleIcons'
import { featurePath, type Feature, type Module } from '@/config/navigation'
import { useIsMenuItemActive } from './useIsMenuItemActive'
import { cn } from '@/lib/cn'
import { sidebarIcon, sidebarRow, sidebarRowLabel } from './sidebarStyles'

type SidebarGroupProps = {
  module: Module
  features: Feature[]
  collapsed: boolean
  isCurrent: boolean
  isOpen: boolean
  onToggle: () => void
  onNavigate: () => void
}

export function SidebarGroup({
  module,
  features,
  collapsed,
  isCurrent,
  isOpen,
  onToggle,
  onNavigate,
}: SidebarGroupProps) {
  const ModuleIcon = moduleIcons[module.slug]
  const listId = `nav-${module.slug}`
  const isMenuItemActive = useIsMenuItemActive()

  return (
    <li>
      <Tooltip content={module.shortLabel} side="right" disabled={!collapsed}>
        <button
          type="button"
          className={sidebarRow(collapsed, cn('hover:bg-side-hover', isCurrent && 'font-semibold'))}
          aria-expanded={collapsed ? undefined : isOpen}
          aria-controls={collapsed ? undefined : listId}
          onClick={onToggle}
        >
          {ModuleIcon && (
            <ModuleIcon
              weight={isCurrent ? 'fill' : 'regular'}
              className={sidebarIcon(isCurrent)}
              aria-hidden="true"
            />
          )}
          <span className={sidebarRowLabel(collapsed)}>{module.shortLabel}</span>
          {!collapsed && (
            <CaretRightIcon
              className="size-3.5 flex-none text-side-muted transition-transform group-aria-expanded:rotate-90 motion-reduce:transition-none"
              aria-hidden="true"
            />
          )}
        </button>
      </Tooltip>

      {isOpen && (
        <ul
          id={listId} // The guide line sits under the centre of the 18px module icon.
          className="ms-[1.1875rem] mt-0.5 mb-1.5 border-s border-side-line ps-2"
        >
          {features.map((feature) => {
            const to = featurePath(module, feature)
            const isActive = isMenuItemActive(to)
            return (
              <li key={feature.slug}>
                <Link
                  to={to}
                  onClick={onNavigate}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group/sub flex min-h-8 items-center gap-2 rounded-md px-2.5 py-1.5 text-[0.8125rem] leading-snug hover:bg-side-hover active:bg-side-active pointer-coarse:min-h-11',
                    // The current page is marked by its text alone: amber and bold.
                    isActive ? 'font-semibold text-accent' : 'text-side-muted hover:text-side-ink',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'text-[0.75rem] leading-none font-normal transition-colors select-none',
                      isActive ? 'text-accent' : 'text-side-muted/60 group-hover/sub:text-side-ink',
                    )}
                  >
                    »
                  </span>
                  <span className="truncate">{feature.shortLabel}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
