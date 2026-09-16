import { ListIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { type RefObject, useEffect, useState } from 'react'
import { iconButtonClasses } from '@/components/ui/buttonStyles'
import { Tooltip } from '@/components/ui/Tooltip'
import { AppLauncherMenu } from './AppLauncherMenu'
import { GlobalSearchDialog } from './GlobalSearchDialog'
import { LanguageSelector } from './LanguageSelector'
import { MoreMenu } from './MoreMenu'
import { NotificationsMenu } from './NotificationsMenu'
import { QuickAddMenu } from './QuickAddMenu'
import { SessionSelector } from './SessionSelector'
import { SettingsMenu } from './SettingsMenu'
import { UserMenu } from './UserMenu'

type NavbarProps = {
  isDesktop: boolean
  sidebarCollapsed: boolean
  menuOpen: boolean
  menuButtonRef: RefObject<HTMLButtonElement | null>
  onMenuClick: () => void
}

export function Navbar({
  isDesktop,
  sidebarCollapsed,
  menuOpen,
  menuButtonRef,
  onMenuClick,
}: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  // Global Ctrl+K / Cmd+K listener to open quick search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-10 flex h-navbar items-center justify-between border-b border-line bg-surface px-3 sm:px-4 print:hidden">
      {/* Left side: Sidebar toggle and quick "more" dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          ref={menuButtonRef}
          type="button"
          className={iconButtonClasses({
            className: 'w-auto min-w-9 gap-1.5 px-2 text-ink-muted hover:text-ink',
          })}
          aria-controls="sidebar"
          aria-expanded={isDesktop ? !sidebarCollapsed : menuOpen}
          aria-label={
            isDesktop
              ? sidebarCollapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
              : 'Open navigation menu'
          }
          onClick={onMenuClick}
        >
          <ListIcon className="size-5.5" aria-hidden="true" />
          {!isDesktop && <span className="text-xs font-semibold text-ink">Menu</span>}
        </button>

        <MoreMenu />
      </div>

      {/* Right side: Session, Language, Search, Quick Add, Notifications, Settings, Apps, User */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <SessionSelector />
        <LanguageSelector />

        <Tooltip content="Quick search (Ctrl+K)">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex size-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-11 pointer-coarse:min-w-11"
            aria-label="Quick search"
          >
            <MagnifyingGlassIcon className="size-5" aria-hidden="true" />
          </button>
        </Tooltip>

        <QuickAddMenu />
        <NotificationsMenu />
        <SettingsMenu />
        <AppLauncherMenu />
        <UserMenu />
      </div>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
