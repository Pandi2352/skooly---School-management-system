import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { AuthScreen } from '../components/AuthScreen'
import { useRequestPasswordReset } from '../hooks/useSession'
import { forgotPasswordFormSchema } from '../schemas/auth.schema'
import type { z } from 'zod'

type ForgotPasswordValues = z.infer<typeof forgotPasswordFormSchema>

/**
 * The answer is the same whether or not the address has an account. Saying "no such account" would
 * turn this form into a way of checking who works at the school.
 */
export function ForgotPasswordPage() {
  const requestReset = useRequestPasswordReset()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: '' },
  })

  const submit = handleSubmit(async (values) => {
    await requestReset.mutateAsync(values.email).catch(() => undefined)
  })

  const backToSignIn = (
    <Link to={paths.login} className="font-medium text-primary hover:underline">
      Back to sign in
    </Link>
  )

  if (requestReset.isSuccess) {
    return (
      <AuthScreen title="Check your email" footer={backToSignIn}>
        <Alert tone="info" title="If that address has an account, a reset link is on its way">
          {requestReset.data}
        </Alert>
        <p className="mt-4 text-sm text-ink-muted">
          Nothing arrived? Look in the spam folder, or ask an administrator at your school to send
          you a new link.
        </p>
      </AuthScreen>
    )
  }

  return (
    <AuthScreen
      title="Forgot your password?"
      description="Enter the email address you sign in with and we’ll send you a link to choose a new password."
      footer={backToSignIn}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {requestReset.isError && (
          <Alert tone="danger" title="Couldn’t send the link">
            {getErrorMessage(requestReset.error)}
          </Alert>
        )}

        <Input
          label="Email address"
          type="email"
          placeholder="you@yourschool.in"
          autoComplete="username"
          autoFocus
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" loading={isSubmitting} className="w-full justify-center">
          Send me a link
        </Button>
      </form>
    </AuthScreen>
  )
}
