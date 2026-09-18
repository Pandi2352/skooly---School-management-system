import { zodResolver } from '@hookform/resolvers/zod'
import { EnvelopeSimpleIcon, LockSimpleIcon, SignInIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { ApiError } from '@/lib/api/ApiError'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useLogin } from '../hooks/useSession'
import { loginFormSchema } from '../schemas/auth.schema'
import { safeRedirect } from '../utils/safeRedirect'
import type { LoginFormValues } from '../types/auth.types'
import { PasswordInput } from './PasswordInput'
import { TwoFactorStep } from './TwoFactorStep'

/** A locked or suspended account needs its own explanation, not a field error next to the password. */
const ACCOUNT_BLOCKED_CODES = ['ACCOUNT_LOCKED', 'ACCOUNT_SUSPENDED', 'ACCOUNT_ARCHIVED']

export function LoginForm() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const signIn = useLogin()
  // Set when the password is right but the account also asks for a code from an authenticator app.
  const [challengeToken, setChallengeToken] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  // Where the person was heading before they were asked to sign in. It comes from the URL, so it is
  // checked before anyone is sent there.
  const next = safeRedirect(params.get('next'), paths.dashboard)

  const submit = handleSubmit(async (values) => {
    try {
      const result = await signIn.mutateAsync(values)
      if (result.twoFactorRequired && result.challengeToken) {
        setChallengeToken(result.challengeToken)
        return
      }
      const destination = result.account?.mustChangePassword ? paths.accountPassword : next
      void navigate(destination, { replace: true })
    } catch (error) {
      if (error instanceof ApiError && ACCOUNT_BLOCKED_CODES.includes(error.errorCode ?? '')) return
      setError('password', { message: getErrorMessage(error) }, { shouldFocus: true })
    }
  })

  const blockedMessage =
    signIn.error instanceof ApiError && ACCOUNT_BLOCKED_CODES.includes(signIn.error.errorCode ?? '')
      ? signIn.error.messages[0]
      : null

  if (challengeToken) {
    return (
      <TwoFactorStep
        challengeToken={challengeToken}
        destination={next}
        onStartOver={() => setChallengeToken(null)}
      />
    )
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-4" noValidate>
      {blockedMessage && (
        <Alert tone="warning" title="You can’t sign in right now">
          {blockedMessage}
        </Alert>
      )}

      <Input
        label="Email address"
        id="login-email"
        type="email"
        startIcon={EnvelopeSimpleIcon}
        placeholder="you@yourschool.in"
        autoComplete="username"
        autoFocus
        error={errors.email?.message}
        {...register('email')}
      />

      <PasswordInput
        label="Password"
        id="login-password"
        startIcon={LockSimpleIcon}
        placeholder="Your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between gap-3 pt-0.5">
        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <Checkbox
              label={<span className="text-xs text-ink-muted select-none">Keep me signed in here</span>}
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />

        <Link
          to={paths.forgotPassword}
          className="rounded-md text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        className="h-10.5 w-full justify-center gap-2 text-sm font-semibold"
      >
        {!isSubmitting && <SignInIcon className="size-4.5" aria-hidden="true" />}
        <span>Sign in</span>
      </Button>
    </form>
  )
}
