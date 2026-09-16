import type { Icon } from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { iconButtonClasses, type ButtonSize } from './buttonStyles'

type IconButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  /** Required: an icon alone has no accessible name. */
  label: string
  icon: Icon
  size?: ButtonSize
  iconClassName?: string
}

export function IconButton({
  label,
  icon: IconComponent,
  size = 'md',
  type = 'button',
  className,
  iconClassName,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={iconButtonClasses({ size, className })}
      {...props}
    >
      <IconComponent
        className={cn(size === 'md' ? 'size-5.5' : 'size-4.5', iconClassName)}
        aria-hidden="true"
      />
    </button>
  )
}
