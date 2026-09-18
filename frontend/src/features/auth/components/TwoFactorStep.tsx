import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon, DeviceMobileIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ApiError } from '@/lib/api/ApiError'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useLoginWithTwoFactor } from '../hooks/useSession'
import { twoFactorCodeFormSchema } from '../schemas/auth.schema'
import type { z } from 'zod'

type TwoFactorStepValues = z.infer<typeof twoFactorCodeFormSchema>

type TwoFactorStepProps = {
  /** The handle from the password step; it is good for a few minutes and can be used once. */
  challengeToken: string
  /** Where to go once the code is accepted. */
  destination: string
  /** Back to the password step, e.g. after the handle expires. */
  onStartOver: () => void
}

/** The second step of signing in: a code from the authenticator app, or a recovery code. */
export function TwoFactorStep({ challengeToken, destination, onStartOver }: TwoFactorStepProps) {
  const navigate = useNavigate()
  const finishSignIn = useLoginWithTwoFactor()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TwoFactorStepValues>({
    resolver: zodResolver(twoFactorCodeFormSchema),
    defaultValues: { code: '' },
  })

  const submit = handleSubmit(async (values) => {
    try {
      const account = await finishSignIn.mutateAsync({ challengeToken, code: values.code })
      void navigate(account.mustChangePassword ? paths.accountPassword : destination, { replace: true })
    } catch (error) {
      setError('code', { message: getErrorMessage(error) }, { shouldFocus: true })
    }
  })

  // The handle has a short life: once it goes, only starting again will do.
  const hasExpired =
    finishSignIn.error instanceof ApiError &&
    finishSignIn.error.errorCode === 'TWO_FACTOR_CHALLENGE_EXPIRED'

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-4" noValidate>
      <div className="flex items-start gap-3 rounded-md border border-line bg-canvas px-3 py-2.5">
        <DeviceMobileIcon className="mt-0.5 size-5 flex-none text-primary" aria-hidden="true" />
        <p className="text-sm text-ink-muted">
          Your password was accepted. Enter the current code from your authenticator app to finish.
        </p>
      </div>

      {hasExpired && (
        <Alert tone="warning" title="This sign-in timed out">
          Start again with your email and password.
        </Alert>
      )}

      <Input
        label="Code from your app"
        id="two-factor-code"
        inputMode="text"
        placeholder="123456"
        hint="Codes change every 30 seconds. You can also use one of your recovery codes."
        autoComplete="one-time-code"
        autoFocus
        error={errors.code?.message}
        {...register('code')}
      />

      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        disabled={hasExpired}
        className="h-10.5 w-full justify-center text-sm font-semibold"
      >
        Finish signing in
      </Button>

      <button
        type="button"
        onClick={onStartOver}
        className="flex w-full items-center justify-center gap-1.5 rounded-md text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
        Use a different account
      </button>
    </form>
  )
}
