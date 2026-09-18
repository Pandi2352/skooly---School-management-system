import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/page/LoadingState'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import {
  useDisableTwoFactor,
  useEnableTwoFactor,
  useRegenerateRecoveryCodes,
  useStartTwoFactorSetup,
  useTwoFactorStatus,
} from '../hooks/useSession'
import { passwordConfirmFormSchema, twoFactorCodeFormSchema } from '../schemas/auth.schema'
import type { TwoFactorSetup } from '../types/auth.types'
import { PasswordInput } from './PasswordInput'
import { RecoveryCodesDialog } from './RecoveryCodesDialog'
import type { z } from 'zod'

type CodeValues = z.infer<typeof twoFactorCodeFormSchema>
type PasswordValues = z.infer<typeof passwordConfirmFormSchema>

/** Few codes left is worth saying before the last one is used on a lost phone. */
const LOW_RECOVERY_CODES = 3

/**
 * Two-step sign-in on the person's own account: switch it on by scanning a QR code, replace the
 * recovery codes, or switch it off. Only the person holding the app can switch it on — an
 * administrator can only switch it off, for someone locked out.
 */
export function TwoFactorCard() {
  const status = useTwoFactorStatus()
  const startSetup = useStartTwoFactorSetup()
  const enable = useEnableTwoFactor()
  const disable = useDisableTwoFactor()
  const regenerate = useRegenerateRecoveryCodes()
  const { toast } = useToast()

  const [setup, setSetup] = useState<TwoFactorSetup | null>(null)
  const [codes, setCodes] = useState<string[] | null>(null)
  const [confirming, setConfirming] = useState<'disable' | 'regenerate' | null>(null)

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(twoFactorCodeFormSchema),
    defaultValues: { code: '' },
  })
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordConfirmFormSchema),
    defaultValues: { password: '' },
  })

  const begin = async () => {
    try {
      setSetup(await startSetup.mutateAsync())
      codeForm.reset()
    } catch (error) {
      toast.error('Couldn’t start the setup', getErrorMessage(error))
    }
  }

  const confirmSetup = codeForm.handleSubmit(async (values) => {
    try {
      const recoveryCodes = await enable.mutateAsync(values.code)
      setSetup(null)
      setCodes(recoveryCodes)
      toast.success('Two-step sign-in is on', 'From now on, signing in also asks for a code.')
    } catch (error) {
      codeForm.setError('code', { message: getErrorMessage(error) }, { shouldFocus: true })
    }
  })

  const confirmWithPassword = passwordForm.handleSubmit(async (values) => {
    try {
      if (confirming === 'disable') {
        const message = await disable.mutateAsync(values.password)
        toast.success('Two-step sign-in is off', message)
        setConfirming(null)
      } else {
        const recoveryCodes = await regenerate.mutateAsync(values.password)
        setConfirming(null)
        setCodes(recoveryCodes)
      }
      passwordForm.reset()
    } catch (error) {
      passwordForm.setError('password', { message: getErrorMessage(error) }, { shouldFocus: true })
    }
  })

  if (status.isPending) return <LoadingState label="Loading two-step sign-in" />

  const state = status.data
  if (!state?.available) {
    return (
      <Card title="Two-step sign-in">
        <p className="text-sm text-ink-muted">
          Not available on this server yet. Whoever runs it needs to set a TWO_FACTOR_KEY, which is
          what keeps authenticator seeds unreadable in the database.
        </p>
      </Card>
    )
  }

  return (
    <>
      <Card
        title="Two-step sign-in"
        description="A code from your phone on top of your password, so a stolen password isn’t enough."
        actions={
          state.enabled ? (
            <Badge tone="success" className="gap-1.5">
              <ShieldCheckIcon className="size-3.5" weight="fill" aria-hidden="true" />
              On
            </Badge>
          ) : (
            <Badge tone="neutral">Off</Badge>
          )
        }
      >
        {state.enabled ? (
          <div className="grid gap-4">
            <p className="text-sm text-ink-muted">
              You have <span className="font-medium text-ink">{state.recoveryCodesLeft}</span> recovery
              {state.recoveryCodesLeft === 1 ? ' code' : ' codes'} left.
            </p>

            {state.recoveryCodesLeft <= LOW_RECOVERY_CODES && (
              <Alert tone="warning" title="You are running low on recovery codes">
                Create a new set now, while you can still sign in.
              </Alert>
            )}

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setConfirming('regenerate')}>
                New recovery codes
              </Button>
              <Button variant="secondary" onClick={() => setConfirming('disable')}>
                Turn off
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <p className="text-sm text-ink-muted">
              You’ll need an authenticator app on your phone — the one your school already uses is
              fine. Setting it up takes a scan and one code.
            </p>
            <div>
              <Button onClick={() => void begin()} loading={startSetup.isPending}>
                Set up two-step sign-in
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog
        open={setup !== null}
        onOpenChange={(open) => {
          if (!open) setSetup(null)
        }}
        title="Set up two-step sign-in"
        description="Scan this with your authenticator app, then enter the code it shows."
      >
        {setup && (
          <form onSubmit={(event) => void confirmSetup(event)} className="grid gap-4" noValidate>
            <div className="grid justify-items-center gap-3">
              {/* The QR code is drawn by the server, so the seed never has to be handled here. */}
              <img
                src={setup.qrCodeDataUrl}
                alt="QR code for your authenticator app"
                className="size-60 rounded-md border border-line bg-surface p-2"
              />
              <p className="text-center text-sm text-ink-muted">
                Can’t scan? Type this into your app instead:
                <br />
                <code className="mt-1 inline-block font-mono text-sm tracking-wider wrap-anywhere text-ink">
                  {setup.secret}
                </code>
              </p>
            </div>

            <Input
              label="Code from your app"
              inputMode="numeric"
              placeholder="123456"
              autoComplete="one-time-code"
              autoFocus
              error={codeForm.formState.errors.code?.message}
              {...codeForm.register('code')}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setSetup(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={codeForm.formState.isSubmitting}>
                Turn it on
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      <Dialog
        open={confirming !== null}
        onOpenChange={(open) => {
          if (!open) {
            setConfirming(null)
            passwordForm.reset()
          }
        }}
        title={confirming === 'disable' ? 'Turn off two-step sign-in?' : 'Create new recovery codes?'}
        description={
          confirming === 'disable'
            ? 'Your password alone will get into this account again. Enter it to confirm.'
            : 'Your current recovery codes stop working straight away. Enter your password to confirm.'
        }
      >
        <form onSubmit={(event) => void confirmWithPassword(event)} className="grid gap-4" noValidate>
          <PasswordInput
            label="Your password"
            autoComplete="current-password"
            placeholder="Your current password"
            autoFocus
            error={passwordForm.formState.errors.password?.message}
            {...passwordForm.register('password')}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setConfirming(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={confirming === 'disable' ? 'danger' : 'primary'}
              loading={passwordForm.formState.isSubmitting}
            >
              {confirming === 'disable' ? 'Turn off' : 'Create new codes'}
            </Button>
          </div>
        </form>
      </Dialog>

      <RecoveryCodesDialog codes={codes} onClose={() => setCodes(null)} />
    </>
  )
}
