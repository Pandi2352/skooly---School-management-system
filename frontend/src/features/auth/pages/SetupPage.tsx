import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { LoadingState } from '@/components/page/LoadingState'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { AuthScreen } from '../components/AuthScreen'
import { PasswordInput } from '../components/PasswordInput'
import { useCreateFirstAdministrator, useSetupState } from '../hooks/useSession'
import { setupFormSchema } from '../schemas/auth.schema'
import type { SetupFormValues } from '../types/auth.types'

/**
 * First run: the school has no accounts, so there is nobody to sign in as and nobody to ask. This
 * page creates the first administrator, who then adds everyone else. No password ships with the
 * app, so this is the only moment an account can be made without one.
 */
export function SetupPage() {
  const navigate = useNavigate()
  const setupState = useSetupState()
  const createAdministrator = useCreateFirstAdministrator()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SetupFormValues>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: { fullName: '', email: '', designation: '', password: '', confirmPassword: '' },
  })

  const submit = handleSubmit(async (values) => {
    try {
      await createAdministrator.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        designation: values.designation || undefined,
      })
      void navigate(paths.dashboard, { replace: true })
    } catch (error) {
      setError('password', { message: getErrorMessage(error) }, { shouldFocus: true })
    }
  })

  if (setupState.isPending) return <LoadingState label="Checking whether this school is set up" />
  // Once an account exists this page is closed for good; everyone else is added from User Accounts.
  if (setupState.data && !setupState.data.needsSetup) return <Navigate to={paths.login} replace />

  return (
    <AuthScreen
      title="Set up your school"
      description="This creates the first administrator account. You can add everyone else afterwards."
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {setupState.isError && (
          <Alert tone="danger" title="Couldn’t reach the server">
            {getErrorMessage(setupState.error)}
          </Alert>
        )}

        <Input
          label="Your full name"
          placeholder="e.g. Asha Menon"
          autoComplete="name"
          autoFocus
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Your email address"
          type="email"
          placeholder="you@yourschool.in"
          hint="You will sign in with this address."
          autoComplete="username"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Your role at the school"
          placeholder="e.g. Principal"
          hint="Optional. Shown next to your name."
          error={errors.designation?.message}
          {...register('designation')}
        />

        <PasswordInput
          label="Password"
          placeholder="At least 10 characters"
          hint="A few unrelated words are easier to remember and harder to guess than a short mixture of symbols."
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Type the password again"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" loading={isSubmitting} className="w-full justify-center">
          Create my account
        </Button>
      </form>
    </AuthScreen>
  )
}
