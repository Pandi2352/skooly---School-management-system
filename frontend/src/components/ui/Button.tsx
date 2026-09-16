import type { ComponentProps } from 'react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'
import { Spinner } from './Spinner'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Disables the button and shows a spinner; the label stays so the action is still named. */
  loading?: boolean
}

export function Button({
  variant,
  size,
  loading = false,
  disabled = false,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  )
}
