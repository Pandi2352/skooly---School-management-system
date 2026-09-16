import { Tooltip as RadixTooltip } from 'radix-ui'
import type { ReactElement, ReactNode } from 'react'

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <RadixTooltip.Provider delayDuration={300}>{children}</RadixTooltip.Provider>
}

type TooltipProps = {
  content: ReactNode
  children: ReactElement
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Renders the child alone, e.g. for sidebar labels that are already visible. */
  disabled?: boolean
}

/** Shows on hover and on keyboard focus. Never the only place a piece of information appears. */
export function Tooltip({ content, children, side = 'top', disabled = false }: TooltipProps) {
  if (disabled) return children

  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={8}
          className="z-50 rounded-sm bg-ink px-2 py-1 text-sm text-canvas shadow-md"
        >
          {content}
          <RadixTooltip.Arrow className="fill-ink" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
