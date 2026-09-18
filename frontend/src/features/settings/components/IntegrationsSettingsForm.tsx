import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChatsCircleIcon,
  CreditCardIcon,
  DeviceMobileIcon,
  EnvelopeSimpleIcon,
} from '@phosphor-icons/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { SectionHeading as SettingsSectionHeading } from '@/components/ui/SectionHeading'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import {
  EMAIL_PROVIDER_OPTIONS,
  SMS_PROVIDER_OPTIONS,
  WHATSAPP_PROVIDER_OPTIONS,
} from '../constants'
import { useUpdateIntegrationsSettings } from '../hooks/useIntegrationsSettings'
import {
  integrationsSettingsSchema,
  type IntegrationsSettingsFormData,
} from '../schemas/integrationsSettings.schema'
import type { IntegrationsSettings } from '../types/settings.types'
import { SettingsFormFooter } from './SettingsFormFooter'

export function IntegrationsSettingsForm({ integrations }: { integrations: IntegrationsSettings }) {
  const { toast } = useToast()
  const updateIntegrations = useUpdateIntegrationsSettings()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<IntegrationsSettingsFormData>({
    resolver: zodResolver(integrationsSettingsSchema),
    defaultValues: {
      email: {
        ...integrations.email,
        password: '',
      },
      sms: {
        ...integrations.sms,
        apiKey: '',
      },
      whatsapp: {
        ...integrations.whatsapp,
        apiKey: '',
      },
    },
  })

  const emailProvider = useWatch({ control, name: 'email.provider' })
  const smsProvider = useWatch({ control, name: 'sms.provider' })
  const whatsappEnabled = useWatch({ control, name: 'whatsapp.enabled' })

  const submit = handleSubmit(async (values) => {
    try {
      const saved = await updateIntegrations.mutateAsync(values)
      reset({
        email: { ...saved.email, password: '' },
        sms: { ...saved.sms, apiKey: '' },
        whatsapp: { ...saved.whatsapp, apiKey: '' },
      })
      toast({
        title: 'Integrations settings saved',
        description: 'SMTP mail, SMS gateway, and messaging credentials updated.',
      })
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t save integrations settings',
        description: getErrorMessage(error),
      })
    }
  })

  return (
    <form noValidate aria-label="Integrations settings" onSubmit={(event) => void submit(event)}>
      <div className="grid gap-7 p-4 sm:p-5">
        <section aria-labelledby="email-delivery-heading" className="grid gap-4">
          <SettingsSectionHeading id="email-delivery-heading" icon={EnvelopeSimpleIcon}>
            Email Delivery (SMTP Gateway)
          </SettingsSectionHeading>

          <div className="max-w-md">
            <Controller
              name="email.provider"
              control={control}
              render={({ field }) => (
                <Select
                  label="Email Service Provider"
                  options={EMAIL_PROVIDER_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.email?.provider?.message}
                />
              )}
            />
          </div>

          {emailProvider !== 'disabled' && (
            <>
              <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
                <Input
                  label="SMTP Server Host"
                  placeholder="e.g. smtp.mailgun.org"
                  required
                  error={errors.email?.host?.message}
                  {...register('email.host')}
                />

                <Input
                  label="SMTP Port"
                  type="number"
                  min={1}
                  max={65535}
                  required
                  placeholder="587"
                  error={errors.email?.port?.message}
                  {...register('email.port', { valueAsNumber: true })}
                />

                <Input
                  label="SMTP Username"
                  placeholder="postmaster@yourdomain.com"
                  autoComplete="username"
                  error={errors.email?.username?.message}
                  {...register('email.username')}
                />

                <Input
                  label="SMTP Password / Auth Token"
                  type="password"
                  autoComplete="new-password"
                  placeholder={
                    integrations.email.hasPassword
                      ? '••••••••  (Saved — leave blank to keep)'
                      : 'Enter SMTP password or API token'
                  }
                  hint={
                    integrations.email.hasPassword
                      ? 'A password is currently saved. Enter a new password only to change it.'
                      : 'Credentials are encrypted and never transmitted in cleartext.'
                  }
                  error={errors.email?.password?.message}
                  {...register('email.password')}
                />

                <Input
                  label="Sender Display Name"
                  placeholder="e.g. Skooly International Academy"
                  required
                  error={errors.email?.fromName?.message}
                  {...register('email.fromName')}
                />

                <Input
                  label="Sender Email Address"
                  type="email"
                  placeholder="notifications@yourschool.edu"
                  required
                  error={errors.email?.fromEmail?.message}
                  {...register('email.fromEmail')}
                />
              </div>

              <div className="rounded-md border border-line bg-canvas/60 p-3.5">
                <Controller
                  name="email.secure"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="emailSecure"
                      label="Use SSL/TLS secure connection (Port 465)"
                      hint="Check this if connecting directly over SSL. Leave unchecked for STARTTLS (Port 587)."
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    />
                  )}
                />
              </div>
            </>
          )}
        </section>

        <section aria-labelledby="sms-gateway-heading" className="grid gap-4">
          <SettingsSectionHeading id="sms-gateway-heading" icon={DeviceMobileIcon}>
            SMS Gateway & Telecommunication
          </SettingsSectionHeading>

          <div className="max-w-md">
            <Controller
              name="sms.provider"
              control={control}
              render={({ field }) => (
                <Select
                  label="SMS Gateway Provider"
                  options={SMS_PROVIDER_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.sms?.provider?.message}
                />
              )}
            />
          </div>

          {smsProvider !== 'disabled' && (
            <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <Input
                label="Sender ID (Header)"
                placeholder="e.g. SKOOLY"
                maxLength={10}
                hint="6-character approved alphabetic header"
                error={errors.sms?.senderId?.message}
                {...register('sms.senderId')}
              />

              <Input
                label="DLT Principal Entity ID"
                placeholder="e.g. 1101552390001"
                hint="Regulatory telecom entity ID (TRAI / DLT mandate)"
                error={errors.sms?.dltEntityId?.message}
                {...register('sms.dltEntityId')}
              />

              <div className="sm:col-span-2">
                <Input
                  label="SMS Provider Auth Token / API Key"
                  type="password"
                  placeholder={
                    integrations.sms.isConfigured
                      ? '••••••••  (Configured — leave blank to keep)'
                      : 'Enter provider API token or auth key'
                  }
                  hint="Kept secret; never shown back in plain text"
                  error={errors.sms?.apiKey?.message}
                  {...register('sms.apiKey')}
                />
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="whatsapp-messaging-heading" className="grid gap-4">
          <SettingsSectionHeading id="whatsapp-messaging-heading" icon={ChatsCircleIcon}>
            WhatsApp Business Messaging
          </SettingsSectionHeading>

          <div className="rounded-md border border-line bg-canvas/60 p-3.5">
            <Controller
              name="whatsapp.enabled"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="whatsappEnabled"
                  label="Enable WhatsApp notifications"
                  hint="Send verified template messages for attendance alerts, fee receipts, and school closures."
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              )}
            />
          </div>

          {whatsappEnabled && (
            <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <div className="max-w-md">
                <Controller
                  name="whatsapp.provider"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="WhatsApp Solution Provider"
                      options={WHATSAPP_PROVIDER_OPTIONS.map((opt) => ({
                        value: opt.value,
                        label: opt.label,
                      }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={errors.whatsapp?.provider?.message}
                    />
                  )}
                />
              </div>

              <Input
                label="WhatsApp Business Phone Number"
                placeholder="+919876543210"
                hint="International format with country code"
                error={errors.whatsapp?.businessPhoneNumber?.message}
                {...register('whatsapp.businessPhoneNumber')}
              />

              <div className="sm:col-span-2">
                <Input
                  label="WhatsApp API Secret / Permanent Token"
                  type="password"
                  placeholder={
                    integrations.whatsapp.isConfigured
                      ? '••••••••  (Configured — leave blank to keep)'
                      : 'Enter WhatsApp provider bearer token'
                  }
                  hint="Used to trigger Meta Business WhatsApp template messages"
                  error={errors.whatsapp?.apiKey?.message}
                  {...register('whatsapp.apiKey')}
                />
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="payments-overview-heading" className="grid gap-4">
          <SettingsSectionHeading id="payments-overview-heading" icon={CreditCardIcon}>
            Online Payment Gateway
          </SettingsSectionHeading>
          <div className="rounded-md border border-line bg-canvas/60 p-4">
            <div className="grid gap-2">
              <span className="text-sm font-medium text-ink">Fee Collection Gateway</span>
              <p className="text-sm text-ink-muted leading-relaxed">
                Online student fee collections via Razorpay and Stripe are centrally managed under
                the Fee Structure & Collections module. Webhook signatures and settlement accounts
                can be configured with your accounts department credentials.
              </p>
            </div>
          </div>
        </section>
      </div>

      <SettingsFormFooter
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onDiscard={() =>
          reset({
            email: { ...integrations.email, password: '' },
            sms: { ...integrations.sms, apiKey: '' },
            whatsapp: { ...integrations.whatsapp, apiKey: '' },
          })
        }
      />
    </form>
  )
}
