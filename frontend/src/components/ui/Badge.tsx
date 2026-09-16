import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'neutral' | 'info' | 'success' | 'planned' | 'primary' | 'danger'

const tones: Record<BadgeTone, string> = {
  neutral: 'border border-line bg-canvas text-ink-muted',
  info: 'border border-primary/25 bg-primary/5 text-primary',
  planned: 'bg-status text-status-ink',
  primary: 'bg-primary text-surface',
  success: 'border border-success/30 bg-success-soft text-success',
  danger: 'border border-danger/30 bg-danger-soft text-danger',
}

type BadgeProps = ComponentProps<'span'> & { tone?: BadgeTone }

/** A status label. The text carries the meaning; colour only reinforces it. */
export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-1.5 py-px text-[0.8125rem] font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
