import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { useState, type ComponentProps } from 'react'
import { Input } from '@/components/ui/Input'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'endAddon'>

/**
 * A password field with a reveal button, used everywhere a password is typed. Seeing what you typed
 * is what stops the second attempt, so this is worth having on every one of these forms.
 */
export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      endAddon={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="flex items-center justify-center rounded-e-md border border-s-0 border-field bg-canvas px-3 text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-primary pointer-coarse:min-w-11"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeSlashIcon className="size-4.5" aria-hidden="true" />
          ) : (
            <EyeIcon className="size-4.5" aria-hidden="true" />
          )}
        </button>
      }
    />
  )
}
