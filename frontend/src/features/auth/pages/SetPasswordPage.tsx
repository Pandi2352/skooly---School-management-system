import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { LoadingState } from '@/components/page/LoadingState'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { checkPasswordToken } from '../api/auth'
import { authKeys } from '../api/authKeys'
import { AuthScreen } from '../components/AuthScreen'
import { PasswordInput } from '../components/PasswordInput'
import { useSetPasswordWithToken } from '../hooks/useSession'
import { newPasswordFormSchema } from '../schemas/auth.schema'
import type { NewPasswordFormValues } from '../types/auth.types'
import { getErrorMessage } from '@/lib/api/getErrorMessage'

/**
 * Where an invitation link and a password reset link both land. The link is checked first, so an
 * expired or already-used one is explained before anyone types a password.
 */
export function SetPasswordPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const setPassword = useSetPasswordWithToken()

  const link = useQuery({
    queryKey: [...authKeys.all, 'token', token],
    queryFn: () => checkPasswordToken(token),
    enabled: token !== '',
    retry: false,
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const submit = handleSubmit(async (values) => {
    try {
      await setPassword.mutateAsync({ token, password: values.password })
      void navigate(paths.dashboard, { replace: true })
    } catch (error) {
      setError('password', { message: getErrorMessage(error) }, { shouldFocus: true })
    }
  })

  const backToSignIn = (
    <Link to={paths.login} className="font-medium text-primary hover:underline">
      Back to sign in
    </Link>
  )

  if (token === '' || link.isError) {
    return (
      <AuthScreen title="This link can’t be used" footer={backToSignIn}>
        <Alert tone="warning" title={token === '' ? 'The link is incomplete' : 'The link has expired or was already used'}>
          {token === ''
            ? 'Open the link from your email again, and copy the whole address if you pasted it.'
            : getErrorMessage(link.error)}
        </Alert>
        <p className="mt-4 text-sm text-ink-muted">
          An administrator at your school can send you a new link.
        </p>
        <Link to={paths.forgotPassword} className={buttonClasses({ variant: 'secondary', className: 'mt-4 w-full' })}>
          Ask for a new link
        </Link>
      </AuthScreen>
    )
  }

  if (link.isPending) return <LoadingState label="Checking your link" />

  const isInvitation = link.data.purpose === 'invitation'

  return (
    <AuthScreen
      title={isInvitation ? 'Welcome — choose your password' : 'Choose a new password'}
      description={
        isInvitation
          ? `Your account is ready, ${link.data.fullName}. Pick a password and you’re in.`
          : `This sets a new password for ${link.data.email}.`
      }
      footer={backToSignIn}
    >
      <form onSubmit={(event) => void submit(event)} className="space-y-4" noValidate>
        {/* The address is shown so nobody sets a password on the wrong account. */}
        <p className="rounded-md border border-line bg-canvas px-3 py-2 text-sm text-ink-muted">
          Signing in as <span className="font-medium text-ink">{link.data.email}</span>
        </p>

        <PasswordInput
          label="New password"
          placeholder="At least 10 characters"
          hint="A few unrelated words work well: easy for you, hard for anyone else."
          autoComplete="new-password"
          autoFocus
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Type it again"
          placeholder="Repeat your new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" loading={isSubmitting} className="w-full justify-center">
          {isInvitation ? 'Set password and sign in' : 'Save new password'}
        </Button>

        <p className="text-xs text-ink-muted">
          Any device already signed in to this account will be signed out.
        </p>
      </form>
    </AuthScreen>
  )
}
