import { zodResolver } from '@hookform/resolvers/zod'
import { CurrencyInrIcon, DoorOpenIcon, LinkSimpleIcon } from '@phosphor-icons/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Switch } from '@/components/ui/Switch'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/lib/api/ApiError'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { ADMISSION_SETTINGS_LIMITS } from '../constants'
import { useUpdateAdmissionSettings } from '../hooks/useAdmissionSettings'
import { admissionSettingsFormSchema } from '../schemas/admissionSettings.schema'
import type { AdmissionSettings, AdmissionSettingsFormValues } from '../types/admissionSettings.types'
import { PaymentQrField } from './PaymentQrField'
import { PublicLinkCard } from './PublicLinkCard'

const formFields = ['admissionsOpen', 'sessionLabel', 'publicSlug', 'feeEnabled', 'feeAmount', 'feeNote'] as const

const toFormValues = (settings: AdmissionSettings): AdmissionSettingsFormValues => ({
  admissionsOpen: settings.admissionsOpen,
  sessionLabel: settings.sessionLabel,
  publicSlug: settings.publicSlug,
  feeEnabled: settings.feeEnabled,
  // Kept as text so an empty box stays empty instead of showing a 0 nobody typed.
  feeAmount: settings.feeAmount > 0 ? String(settings.feeAmount) : '',
  feeNote: settings.feeNote,
})

const isFormField = (field: string): field is keyof AdmissionSettingsFormValues =>
  formFields.some((name) => name === field)

/**
 * Whether the school is taking applications, what applying costs and how families pay, and the
 * address the public form will use. The QR code saves on its own (see PaymentQrField); everything
 * else is saved together with Save.
 */
export function AdmissionSettingsEditor({ settings }: { settings: AdmissionSettings }) {
  const { toast } = useToast()
  const update = useUpdateAdmissionSettings()
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AdmissionSettingsFormValues>({
    resolver: zodResolver(admissionSettingsFormSchema),
    defaultValues: toFormValues(settings),
  })
  const watched = useWatch({ control })
  const draft: AdmissionSettingsFormValues = { ...toFormValues(settings), ...watched }

  // A fee with no way to pay it stops families applying, so charging one waits for the code.
  const hasPaymentQr = settings.paymentQr !== null

  const save = handleSubmit(async (values) => {
    try {
      const saved = await update.mutateAsync({
        admissionsOpen: values.admissionsOpen,
        sessionLabel: values.sessionLabel,
        publicSlug: values.publicSlug,
        feeEnabled: values.feeEnabled,
        feeAmount: values.feeAmount === '' ? 0 : Number(values.feeAmount),
        feeNote: values.feeNote,
      })
      reset(toFormValues(saved))
      toast.success('Admission settings saved')
    } catch (error) {
      // Show the server's field messages next to the fields they belong to.
      if (error instanceof ApiError) {
        for (const fieldError of error.fieldErrors) {
          if (isFormField(fieldError.field)) setError(fieldError.field, { message: fieldError.message })
        }
      }
      toast.error('Couldn’t save admission settings', getErrorMessage(error))
    }
  })

  const counter = (value: string, max: number) => `${String(value.length)}/${String(max)}`

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <form
        noValidate
        aria-label="Admission settings"
        onSubmit={(event) => void save(event)}
        className="@container min-w-0 rounded-md border border-line bg-surface"
      >
        <div className="grid gap-5 p-4 @xl:p-5">
          <section className="grid gap-4">
            <SectionHeading id="admission-status" icon={DoorOpenIcon}>
              Taking applications
            </SectionHeading>
            <div className="grid gap-x-4 gap-y-3.5 @2xl:grid-cols-2">
              <Controller
                control={control}
                name="admissionsOpen"
                render={({ field }) => (
                  <Switch
                    variant="field"
                    label="Accept new applications"
                    hint="Off closes the public form. Walk-in admissions from the office still work."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Input
                label="Academic session"
                autoComplete="off"
                placeholder="e.g. 2026-27"
                hint={`Shown to families on the application form. ${counter(draft.sessionLabel, ADMISSION_SETTINGS_LIMITS.sessionLabelMax)}`}
                maxLength={ADMISSION_SETTINGS_LIMITS.sessionLabelMax}
                error={errors.sessionLabel?.message}
                {...register('sessionLabel')}
              />
            </div>
          </section>

          <section className="grid gap-4">
            <SectionHeading id="admission-fee" icon={CurrencyInrIcon}>
              Application fee
            </SectionHeading>
            <div className="grid gap-x-4 gap-y-3.5 @2xl:grid-cols-2">
              <Controller
                control={control}
                name="feeEnabled"
                render={({ field }) => (
                  <Switch
                    variant="field"
                    label="Charge an application fee"
                    hint={
                      hasPaymentQr
                        ? 'Families pay by scanning the QR code below before they submit.'
                        : 'Upload a payment QR code first, or families have nowhere to pay.'
                    }
                    checked={field.value && hasPaymentQr}
                    disabled={!hasPaymentQr}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Input
                label="Fee amount"
                inputMode="numeric"
                autoComplete="off"
                placeholder="e.g. 250"
                hint="In rupees, whole numbers only."
                error={errors.feeAmount?.message}
                {...register('feeAmount')}
              />
            </div>
            <Textarea
              label="Note next to the fee"
              rows={2}
              placeholder="e.g. Non-refundable. Keep the payment reference for your records."
              hint={`Families read this beside the amount. ${counter(draft.feeNote, ADMISSION_SETTINGS_LIMITS.noteMax)}`}
              maxLength={ADMISSION_SETTINGS_LIMITS.noteMax}
              error={errors.feeNote?.message}
              {...register('feeNote')}
            />
            <PaymentQrField settings={settings} />
          </section>

          <section className="grid gap-4">
            <SectionHeading id="admission-link" icon={LinkSimpleIcon}>
              Public address
            </SectionHeading>
            <Input
              label="Custom URL"
              autoComplete="off"
              placeholder="e.g. green-valley"
              hint="Lower case letters, numbers and dashes. Changing it breaks any link already shared."
              maxLength={ADMISSION_SETTINGS_LIMITS.slugMax}
              error={errors.publicSlug?.message}
              {...register('publicSlug')}
            />
          </section>
        </div>

        <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 rounded-b-md border-t border-line bg-surface px-4 py-3 @xl:px-5">
          {isDirty && (
            <span className="me-auto text-sm font-semibold text-status-ink" aria-live="polite">
              Unsaved changes
            </span>
          )}
          <Button
            variant="secondary"
            disabled={!isDirty || isSubmitting}
            onClick={() => reset(toFormValues(settings))}
          >
            Discard
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save
          </Button>
        </div>
      </form>

      <PublicLinkCard settings={settings} draftSlug={draft.publicSlug} />
    </div>
  )
}
