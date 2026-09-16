import { cn } from '@/lib/cn'

// Kept apart from Button.tsx so links can look like buttons too.

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'md' | 'sm'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-surface hover:bg-primary/90 active:bg-primary/80',
  secondary: 'border border-control bg-surface text-ink hover:bg-canvas active:bg-line',
  ghost: 'text-ink-muted hover:bg-canvas hover:text-ink active:bg-line',
  danger: 'bg-danger text-surface hover:bg-danger/90 active:bg-danger/80',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-10 px-3.5 text-sm pointer-coarse:h-11',
  // Compact with a mouse, still 44px tall on touch screens.
  sm: 'h-8 px-2.5 text-[0.8125rem] pointer-coarse:h-11',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )
}

export function iconButtonClasses({
  size = 'md',
  className,
}: { size?: ButtonSize; className?: string } = {}) {
  return cn(
    'inline-flex flex-none cursor-pointer items-center justify-center rounded-md text-ink-muted hover:bg-canvas hover:text-ink active:bg-line disabled:cursor-not-allowed disabled:opacity-60',
    size === 'md' ? 'size-10 pointer-coarse:size-11' : 'size-8 pointer-coarse:size-11',
    className,
  )
}
