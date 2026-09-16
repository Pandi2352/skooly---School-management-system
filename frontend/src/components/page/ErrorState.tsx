import { ArrowClockwiseIcon, WarningCircleIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

type ErrorStateProps = {
  /** What failed. */
  title: string
  /** What the user can do about it. */
  description: ReactNode
  onRetry?: () => void
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="grid justify-items-center gap-2 px-4 py-12 text-center">
      <WarningCircleIcon className="size-8 text-danger" aria-hidden="true" />
      <p className="text-base font-semibold">{title}</p>
      <p className="max-w-md text-ink-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-2" onClick={onRetry}>
          <ArrowClockwiseIcon className="size-4" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  )
}
