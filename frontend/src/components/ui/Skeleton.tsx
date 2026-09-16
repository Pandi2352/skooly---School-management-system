import { cn } from '@/lib/cn'

/** A placeholder shape. Hidden from screen readers, so pair it with a text status. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-sm bg-line motion-reduce:animate-none', className)}
    />
  )
}
