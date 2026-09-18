import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { PasswordInput } from '../components/PasswordInput'
import { useChangeOwnPassword, useSession } from '../hooks/useSession'
import { changePasswordFormSchema } from '../schemas/auth.schema'
import type { ChangePasswordFormValues } from '../types/auth.types'

/**
 * Changing your own password. Also where someone signing in with a temporary password is sent:
 * until they replace it, every other page is closed to them, so this page has to stand on its own.
 */
export function AccountPasswordPage() {
  const navigate = useNavigate()
  const session = useSession()
  const changePassword = useChangeOwnPassword()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const submit = handleSubmit(async (values) => {
    try {
      const result = await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      reset()
      toast.success(
        'Password changed',
        result.otherSessionsEnded > 0
          ? `Your other ${result.otherSessionsEnded === 1 ? 'device was' : 'devices were'} signed out.`
          : 'Use your new password the next time you sign in.',
      )
      void navigate(paths.account, { replace: true })
    } catch (error) {
      setError('currentPassword', { message: getErrorMessage(error) }, { shouldFocus: true })
    }
  })

  if (session.isPending) return <LoadingState label="Loading your account" />

  const mustChange = session.data?.mustChangePassword ?? false

  return (
    <PageContainer
      title={mustChange ? 'Choose your own password' : 'Change password'}
      description={
        mustChange
          ? 'You signed in with a password someone else set. Choose your own to carry on.'
          : 'Your other signed-in devices will be signed out.'
      }
    >
      <Card className="max-w-lg">
        <form onSubmit={submit} className="space-y-4" noValidate>
          {mustChange && (
            <Alert tone="warning" title="A temporary password is in use">
              Until you set your own password, the rest of the app stays closed.
            </Alert>
          )}

          <PasswordInput
            label={mustChange ? 'The password you were given' : 'Current password'}
            autoComplete="current-password"
            placeholder="Your current password"
            autoFocus
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <PasswordInput
            label="New password"
            placeholder="At least 10 characters"
            hint="A few unrelated words are easier to remember and harder to guess than a short mixture of symbols."
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <PasswordInput
            label="Type the new password again"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" loading={isSubmitting}>
            Save new password
          </Button>
        </form>
      </Card>
    </PageContainer>
  )
}
