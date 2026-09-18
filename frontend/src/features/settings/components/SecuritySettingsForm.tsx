import { zodResolver } from '@hookform/resolvers/zod'
import { ClockIcon, LockKeyIcon, ShieldCheckIcon } from '@phosphor-icons/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { SectionHeading as SettingsSectionHeading } from '@/components/ui/SectionHeading'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { TWO_FACTOR_OPTIONS } from '../constants'
import { useUpdateSecuritySettings } from '../hooks/useSecuritySettings'
import {
  securitySettingsSchema,
  type SecuritySettingsFormData,
} from '../schemas/securitySettings.schema'
import type { SecuritySettings } from '../types/settings.types'
import { SettingsFormFooter } from './SettingsFormFooter'

export function SecuritySettingsForm({ security }: { security: SecuritySettings }) {
  const { toast } = useToast()
  const updateSecurity = useUpdateSecuritySettings()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SecuritySettingsFormData>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: security,
  })

  const rememberMeEnabled = useWatch({ control, name: 'rememberMeEnabled' })

  const submit = handleSubmit(async (values) => {
    try {
      const saved = await updateSecurity.mutateAsync(values)
      reset(saved)
      toast({
        title: 'Security settings saved',
        description: 'Authentication, lockout rules, and password policies updated.',
      })
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t save security settings',
        description: getErrorMessage(error),
      })
    }
  })

  return (
    <form noValidate aria-label="Security settings" onSubmit={(event) => void submit(event)}>
      <div className="grid gap-7 p-4 sm:p-5">
        <section aria-labelledby="session-policies" className="grid gap-4">
          <SettingsSectionHeading id="session-policies" icon={ClockIcon}>
            Session & Lockout Policies
          </SettingsSectionHeading>
          <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
            <Input
              label="Session Inactivity Timeout (minutes)"
              type="number"
              min={5}
              max={1440}
              required
              hint="Automatically sign out inactive staff (5 to 1440 mins)"
              error={errors.sessionIdleMinutes?.message}
              {...register('sessionIdleMinutes', { valueAsNumber: true })}
            />

            <Input
              label="Max Failed Attempts Before Lockout"
              type="number"
              min={3}
              max={20}
              required
              hint="Rate-limits brute force attempts (3 to 20)"
              error={errors.maxLoginAttempts?.message}
              {...register('maxLoginAttempts', { valueAsNumber: true })}
            />

            <Input
              label="Lockout Duration (minutes)"
              type="number"
              min={1}
              max={1440}
              required
              hint="Time locked account must wait (1 to 1440 mins)"
              error={errors.lockoutDurationMinutes?.message}
              {...register('lockoutDurationMinutes', { valueAsNumber: true })}
            />

            <Input
              label="Remember Me Session Duration (days)"
              type="number"
              min={1}
              max={90}
              disabled={!rememberMeEnabled}
              hint="Valid when Remember Me is enabled (1 to 90 days)"
              error={errors.rememberMeDays?.message}
              {...register('rememberMeDays', { valueAsNumber: true })}
            />
          </div>

          <div className="rounded-md border border-line bg-canvas/60 p-3.5">
            <Controller
              name="rememberMeEnabled"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="rememberMeEnabled"
                  label="Allow Remember Me on login"
                  hint="Lets staff members choose to stay signed in on trusted personal computers"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              )}
            />
          </div>
        </section>

        <section aria-labelledby="password-complexity" className="grid gap-4">
          <SettingsSectionHeading id="password-complexity" icon={LockKeyIcon}>
            Password Complexity Rules
          </SettingsSectionHeading>
          <div className="max-w-xs">
            <Input
              label="Minimum Password Length"
              type="number"
              min={8}
              max={32}
              required
              hint="Recommended 8 characters or more"
              error={errors.passwordMinLength?.message}
              {...register('passwordMinLength', { valueAsNumber: true })}
            />
          </div>

          <div className="grid gap-3 rounded-md border border-line bg-canvas/60 p-4">
            <Controller
              name="requireSpecialChar"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="requireSpecialChar"
                  label="Require at least one special character (!@#$%^&*)"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              )}
            />

            <Controller
              name="requireNumber"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="requireNumber"
                  label="Require at least one numeric digit (0-9)"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              )}
            />

            <Controller
              name="requireUppercase"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="requireUppercase"
                  label="Require at least one uppercase letter (A-Z)"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              )}
            />
          </div>
        </section>

        <section aria-labelledby="two-factor-auth" className="grid gap-4">
          <SettingsSectionHeading id="two-factor-auth" icon={ShieldCheckIcon}>
            Staff Multi-Factor Authentication (2FA)
          </SettingsSectionHeading>
          <div className="rounded-md border border-line bg-canvas/60 p-4">
            <Controller
              name="twoFactorEnforcement"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="2FA Enforcement Policy"
                  options={TWO_FACTOR_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                    description: opt.description,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.twoFactorEnforcement?.message}
                />
              )}
            />
          </div>
        </section>
      </div>

      <SettingsFormFooter
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onDiscard={() => reset(security)}
      />
    </form>
  )
}

export default SecuritySettingsForm
