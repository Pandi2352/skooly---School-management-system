import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useNavigation } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { cn } from '@/lib/cn'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { Navbar } from './navbar/Navbar'
import { Sidebar } from './sidebar/Sidebar'

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'

export function AppLayout() {
  // Matches Tailwind's `lg` breakpoint.
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsedPref, setCollapsedPref] = useLocalStorage(
    STORAGE_KEYS.sidebarCollapsed,
    false,
    isBoolean,
  )
  const isNavigating = useNavigation().state === 'loading'
  const isOnline = useOnlineStatus()

  const open = !isDesktop && drawerOpen
  const collapsed = isDesktop && collapsedPref

  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const mainRef = useRef<HTMLElement>(null)

  const closeDrawer = useCallback((returnFocusTo: 'menu' | 'main') => {
    setDrawerOpen(false)
    // Wait a frame so the content column is no longer inert before focusing into it.
    requestAnimationFrame(() => {
      const target = returnFocusTo === 'menu' ? menuButtonRef : mainRef
      target.current?.focus()
    })
  }, [])

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer('menu')
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, closeDrawer])

  return (
    <div className="min-h-dvh">
      <Sidebar
        mode={isDesktop ? 'static' : 'drawer'}
        open={isDesktop || open}
        collapsed={collapsed}
        closeButtonRef={closeButtonRef}
        onClose={() => closeDrawer('menu')}
        onExpand={() => setCollapsedPref(false)}
        onNavigate={() => {
          if (open) closeDrawer('main')
        }}
      />
      {open && (
        // Pointer shortcut only; keyboard users close with Escape or the Close button.
        <div className="fixed inset-0 z-15 bg-backdrop" onClick={() => closeDrawer('menu')} />
      )}
      <div
        className={cn(
          'flex min-h-dvh min-w-0 flex-col transition-[margin] duration-150 motion-reduce:transition-none print:ms-0',
          collapsed ? 'lg:ms-sidebar-collapsed' : 'lg:ms-sidebar',
        )}
        inert={open}
      >
        <Navbar
          isDesktop={isDesktop}
          sidebarCollapsed={collapsed}
          menuOpen={open}
          menuButtonRef={menuButtonRef}
          onMenuClick={() => (isDesktop ? setCollapsedPref(!collapsed) : setDrawerOpen(true))}
        />
        <main
          id="main"
          ref={mainRef}
          tabIndex={-1}
          aria-busy={isNavigating || undefined}
          className={cn(
            // min-w-0 lets wide content (tables) scroll inside itself instead of widening the page.
            'w-full min-w-0 px-3 pt-5 pb-10 transition-opacity sm:px-4 lg:px-5 lg:pt-6',
            isNavigating && 'opacity-60',
          )}
        >
          {!isOnline && (
            <Alert tone="warning" title="You’re offline" className="mb-6">
              New data won’t load and changes can’t be saved until the connection is back. This
              message goes away when you reconnect.
            </Alert>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
