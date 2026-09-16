import { SpinnerGapIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

/** Decorative. Always pair it with visible text that says what is loading. */
export function Spinner({ className }: { className?: string }) {
  return (
    <SpinnerGapIcon
      className={cn('size-5 animate-spin motion-reduce:animate-none', className)}
      aria-hidden="true"
    />
  )
}
