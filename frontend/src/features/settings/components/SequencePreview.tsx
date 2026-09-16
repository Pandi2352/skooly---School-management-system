import { useWatch } from 'react-hook-form'
import { cn } from '@/lib/cn'
import type { SequenceName, SystemSettings } from '../types/settings.types'
import { formatSequenceNumber } from '../utils/sequenceFormat'

type SequencePreviewProps = {
  name: SequenceName
  today: Date
  tone?: 'primary' | 'success'
}

/** The number the current choices produce today; updates as the fields change. */
export function SequencePreview({ name, today, tone = 'primary' }: SequencePreviewProps) {
  const sequence = useWatch<SystemSettings, SequenceName>({ name })

  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border border-line bg-canvas px-4 py-3 text-sm">
      <span className="font-bold text-ink">Live preview:</span>
      <output
        className={cn(
          'font-mono text-base font-bold break-all',
          tone === 'success' ? 'text-success' : 'text-primary',
        )}
      >
        {formatSequenceNumber(sequence, today)}
      </output>
    </p>
  )
}
