import { EyeIcon, EyeSlashIcon, LockSimpleIcon, SignInIcon, UserIcon } from '@phosphor-icons/react'
import { useState, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import { loginSchema } from '../schemas/login.schema'
import type { ErpRole } from '../types/auth.types'

type LoginFormProps = {
  initialEmail?: string
  role: ErpRole
}

export function LoginForm({ initialEmail = 'admin@skooly.edu', role }: LoginFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [identifier, setIdentifier] = useState(initialEmail)
  const [password, setPassword] = useState('Skooly@2026')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({})
  const [showForgotDialog, setShowForgotDialog] = useState(false)

  // Update identifier when role changes
  if (initialEmail && identifier !== initialEmail && !identifier.includes('@custom')) {
    setIdentifier(initialEmail)
  }

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = loginSchema.safeParse({ identifier, password, rememberMe })
    if (!result.success) {
      const fieldErrors: { identifier?: string; password?: string } = {}
      for (const issue of result.error.issues) {
        if (issue.path[0] === 'identifier') fieldErrors.identifier = issue.message
        if (issue.path[0] === 'password') fieldErrors.password = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      setLoading(false)
      // Store session role
      try {
        localStorage.setItem(
          'erp-auth-user',
          JSON.stringify({
            email: identifier,
            role,
            loggedInAt: new Date().toISOString(),
          }),
        )
      } catch {
        // Ignore storage errors
      }

      toast({
        title: 'Authentication Successful',
        description: `Welcome back to Skooly ERP. Logged in with ${role.toUpperCase()} privileges.`,
      })

      void navigate(paths.dashboard)
    }, 600)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Staff Email or ID"
          id="login-identifier"
          type="text"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value)
            if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }))
          }}
          startIcon={UserIcon}
          placeholder="e.g. admin@skooly.edu or STF-1002"
          required
          autoComplete="username"
          error={errors.identifier}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            startIcon={LockSimpleIcon}
            placeholder="Enter institutional password"
            required
            autoComplete="current-password"
            error={errors.password}
            endAddon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="flex items-center justify-center rounded-e-md border border-s-0 border-field bg-canvas px-3 text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-primary pointer-coarse:min-w-11"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="size-4.5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="size-4.5" aria-hidden="true" />
                )}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between pt-0.5 text-xs">
          <Checkbox
            label={
              <span className="text-xs text-ink-muted select-none">Remember this workstation</span>
            }
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />

          <button
            type="button"
            onClick={() => setShowForgotDialog(true)}
            className="rounded-md font-medium text-primary hover:text-primary/80 hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="h-10.5 w-full justify-center gap-2 text-sm font-semibold"
        >
          {!loading && <SignInIcon className="size-4.5" aria-hidden="true" />}
          <span>Sign In to ERP Portal</span>
        </Button>
      </form>

      <ConfirmDialog
        open={showForgotDialog}
        onOpenChange={setShowForgotDialog}
        title="Institutional Credential Recovery"
        description="For security protocols of single-institution school management, passwords can only be reset by the School IT Office or System Administrator. Please contact ext. 104 or write to it-support@skooly.edu with your Staff ID."
        confirmLabel="Understood"
        tone="primary"
        onConfirm={() => setShowForgotDialog(false)}
      />
    </>
  )
}
