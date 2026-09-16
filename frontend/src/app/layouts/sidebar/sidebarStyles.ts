import { cn } from '@/lib/cn'

// Rows are compact with a mouse (36px) and grow to 44px on touch screens.
export const sidebarRow = (collapsed: boolean, extra?: string) =>
  cn(
    'group flex w-full cursor-pointer items-center rounded-md text-start text-sm leading-snug active:bg-side-active',
    collapsed
      ? 'mx-auto size-10 justify-center pointer-coarse:size-11'
      : 'min-h-9 gap-2.5 px-2.5 py-1.5 pointer-coarse:min-h-11',
    extra,
  )

// Long module names wrap to a second line instead of being cut off.
export const sidebarRowLabel = (collapsed: boolean) => (collapsed ? 'sr-only' : 'min-w-0 flex-1')

// Amber marks where you are (DESIGN.md); other icons stay muted.
export const sidebarIcon = (isCurrent: boolean) =>
  cn('size-4.5 flex-none', isCurrent ? 'text-accent' : 'text-side-muted group-hover:text-side-ink')

export const sidebarIconButton =
  'inline-flex size-10 cursor-pointer items-center justify-center rounded-md text-side-muted hover:bg-side-hover hover:text-side-ink active:bg-side-active pointer-coarse:size-11'
