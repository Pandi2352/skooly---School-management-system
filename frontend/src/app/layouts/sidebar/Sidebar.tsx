import { SquaresFourIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Tooltip } from '@/components/ui/Tooltip'
import { moduleIcons } from '@/config/moduleIcons'
import { navSections } from '@/config/navigation'
import { cn } from '@/lib/cn'
import type { Branding } from '@/features/branding/types/branding.types'
import { SidebarFooter } from './SidebarFooter'
import { SidebarGroup } from './SidebarGroup'
import { SidebarItem } from './SidebarItem'
import { sidebarIconButton } from './sidebarStyles'

type SidebarProps = {
  /** `static` on desktop; `drawer` slides over the page on smaller screens. */
  mode: 'static' | 'drawer'
  open: boolean
  collapsed: boolean
  closeButtonRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
  onExpand: () => void
  onNavigate: () => void
  branding?: Branding
}

// Closing also transitions visibility so the drawer stays visible while it slides out;
// opening switches visibility at once so focus can move into it immediately.
const drawerState = {
  open: 'visible translate-x-0 shadow-[4px_0_24px_rgb(0_0_0/0.3)] transition-[translate]',
  closed: 'invisible -translate-x-full transition-[translate,visibility]',
}

export function Sidebar({
  mode,
  open,
  collapsed,
  closeButtonRef,
  onClose,
  onExpand,
  onNavigate,
  branding,
}: SidebarProps) {
  const { pathname } = useLocation()
  const activeModule = pathname.split('/')[1] ?? ''
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const navRef = useRef<HTMLElement>(null)

  const logoUrl = branding?.assets.logo?.url ?? '/skooly-logo.jpg'
  const schoolName = branding?.displayName ?? 'Skooly'
  const subLabel = branding?.shortName ?? 'School ERP'
  const brandLabel = `${schoolName} · ${subLabel}`

  useEffect(() => {
    // With 13 modules the current page can start below the fold. Scroll the nav vertically only:
    // scrollIntoView also scrolled it sideways, which pushed the module icons out of view.
    const nav = navRef.current
    const current = nav?.querySelector('[aria-current="page"]')
    if (!nav || !current) return
    const offset = current.getBoundingClientRect().top - nav.getBoundingClientRect().top
    if (offset > nav.clientHeight - 48) nav.scrollTop += offset - nav.clientHeight / 2
  }, [])

  const drawerProps =
    mode === 'drawer'
      ? { role: 'dialog', 'aria-modal': true, 'aria-label': 'Menu' }
      : { 'aria-label': 'Sidebar' }

  return (
    <aside
      id="sidebar"
      className={cn(
        'fixed inset-y-0 start-0 z-20 flex w-[min(var(--spacing-sidebar),85vw)] flex-col bg-side text-side-ink duration-150 ease-out **:focus-visible:outline-accent! motion-reduce:transition-none lg:visible lg:translate-x-0 lg:shadow-none lg:transition-[width] print:hidden',
        open ? drawerState.open : drawerState.closed,
        collapsed ? 'lg:w-sidebar-collapsed' : 'lg:w-sidebar',
      )}
      {...drawerProps}
    >
      <div
        className={cn(
          'flex h-navbar flex-none items-center border-b border-side-line',
          collapsed ? 'justify-center px-2' : 'justify-between px-4',
        )}
      >
        <Tooltip content={brandLabel} side="right" disabled={!collapsed}>
          <Link
            to={paths.dashboard}
            onClick={onNavigate}
            className={cn(
              'group flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-accent',
              collapsed ? 'size-10 justify-center' : 'hover:opacity-95',
            )}
            aria-label={brandLabel}
          >
            <img
              src={logoUrl}
              alt={schoolName}
              className={cn(
                'ring-white/15 shrink-0 rounded-lg object-cover shadow-xs ring-1 transition-transform duration-150 group-hover:scale-105',
                collapsed ? 'size-9' : 'size-8.5',
              )}
            />
            {!collapsed && (
              <div className="flex min-w-0 flex-col">
                <span
                  className="text-base leading-none font-bold tracking-tight whitespace-nowrap text-side-ink truncate max-w-[140px]"
                  title={schoolName}
                >
                  {schoolName}
                </span>
                <span
                  className="mt-1 text-[10px] leading-none font-semibold tracking-wider whitespace-nowrap text-side-muted uppercase truncate max-w-[140px]"
                >
                  {subLabel}
                </span>
              </div>
            )}
          </Link>
        </Tooltip>

        {mode === 'drawer' && (
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            className={sidebarIconButton}
            onClick={onClose}
          >
            <XIcon className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Thin, navy-toned scrollbar (hidden in the icon strip, where it would push icons off centre); never scroll sideways. */}
      <nav
        ref={navRef}
        aria-label="Main"
        className={cn(
          'flex-1 [scrollbar-color:var(--color-side-input-line)_transparent] overflow-x-hidden overflow-y-auto overscroll-contain pt-3 pb-4',
          // `!` beats the app-wide thin scrollbar set on every element in index.html.
          collapsed ? '[scrollbar-width:none]!' : '[scrollbar-width:thin] px-2',
        )}
      >
        <SidebarItem
          to={paths.dashboard}
          label="Dashboard"
          icon={SquaresFourIcon}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />

        {navSections.map((navSection) => (
          <div key={navSection.label}>
            {collapsed ? (
              <div className="mx-auto my-3 w-8 border-t border-side-line" />
            ) : (
              <p className="px-2.5 pt-4 pb-1.5 text-xs font-semibold text-side-muted">
                {navSection.label}
              </p>
            )}

            <ul
              aria-label={navSection.label}
              className={cn('grid', collapsed ? 'gap-1' : 'gap-0.5')}
            >
              {navSection.modules.map((module) => {
                // A module without sub-pages is a plain link, like Dashboard.
                if (module.features.length === 0) {
                  return (
                    <li key={module.slug}>
                      <SidebarItem
                        to={paths.module(module.slug)}
                        label={module.shortLabel}
                        icon={moduleIcons[module.slug] ?? SquaresFourIcon}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                      />
                    </li>
                  )
                }
                // Built features live at their own URL (e.g. /students), outside the module slug.
                const isCurrent =
                  module.slug === activeModule ||
                  module.features.some((f) => f.route !== undefined && pathname.startsWith(f.route))
                const isOpen = !collapsed && (toggled[module.slug] ?? isCurrent)
                return (
                  <SidebarGroup
                    key={module.slug}
                    module={module}
                    features={module.features}
                    collapsed={collapsed}
                    isCurrent={isCurrent}
                    isOpen={isOpen}
                    onNavigate={onNavigate}
                    onToggle={() => {
                      setToggled((prev) => ({ ...prev, [module.slug]: collapsed || !isOpen }))
                      if (collapsed) onExpand()
                    }}
                  />
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <SidebarFooter collapsed={collapsed} onNavigate={onNavigate} />
    </aside>
  )
}
