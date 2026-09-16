import type { Icon } from '@phosphor-icons/react'
import { iconButtonClasses } from '@/components/ui/buttonStyles'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/cn'

type ToolButtonProps = {
  label: string
  icon: Icon
  onClick: () => void
  disabled?: boolean
  /** Pass for on/off tools (bold, alignment); leave out for plain actions. */
  pressed?: boolean
}

/** Small icon button with a tooltip, for the designer's toolbars and panels. */
export function ToolButton({
  label,
  icon: ButtonIcon,
  onClick,
  disabled = false,
  pressed,
}: ToolButtonProps) {
  return (
    <Tooltip content={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={pressed}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          iconButtonClasses({ size: 'sm' }),
          pressed === true && 'bg-primary text-surface hover:bg-primary hover:text-surface',
        )}
      >
        <ButtonIcon className="size-4.5" aria-hidden="true" />
      </button>
    </Tooltip>
  )
}
