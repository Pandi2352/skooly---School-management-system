import { zodResolver } from '@hookform/resolvers/zod'
import {
  GearSixIcon,
  IdentificationCardIcon,
  ListNumbersIcon,
  ReceiptIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Alert } from '@/components/ui/Alert'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { CURRENCY_OPTIONS, RECEIPT_TEMPLATE_OPTIONS } from '../constants'
import { useUpdateSystemSettings } from '../hooks/useSystemSettings'
import { systemSettingsSchema } from '../schemas/systemSettings.schema'
import type { SystemSettings } from '../types/settings.types'
import { SequenceFields, DatedSequenceFields } from './SequenceFields'
import { SequencePreview } from './SequencePreview'
import { SettingsFormFooter } from './SettingsFormFooter'
import { SectionHeading as SettingsSectionHeading } from '@/components/ui/SectionHeading'

const prefixHint = 'Letters, numbers, - / or _. Leave blank for no prefix.'

export function SystemSettingsForm({ settings }: { settings: SystemSettings }) {
  const { toast } = useToast()
  const updateSettings = useUpdateSystemSettings()
  // Previews and option labels use one date for the whole visit.
  const [today] = useState(() => new Date())
  const form = useForm<SystemSettings>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: settings,
  })
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = form

  const submit = handleSubmit(async (values) => {
    try {
      const saved = await updateSettings.mutateAsync(values)
      reset(saved)
      toast({
        title: 'System settings saved',
        description: 'Saved for this session only. Sample data resets when the page reloads.',
      })
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t save the system settings',
        description: getErrorMessage(error),
      })
    }
  })

  return (
    <FormProvider {...form}>
      <form noValidate aria-label="System and formats" onSubmit={(event) => void submit(event)}>
        <div className="grid gap-7 p-4 sm:p-5">
          <section aria-labelledby="system-academic" className="grid gap-4">
            <SettingsSectionHeading id="system-academic" icon={GearSixIcon}>
              System & academic settings
            </SettingsSectionHeading>
            <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <Input
                label="School Code / UDISE"
                placeholder="e.g. 09123456789"
                autoComplete="off"
                error={errors.schoolCode?.message}
                {...register('schoolCode')}
              />
              <Input
                label="Affiliated By"
                placeholder="e.g. CBSE"
                autoComplete="off"
                error={errors.affiliatedBy?.message}
                {...register('affiliatedBy')}
              />
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select
                    label="Currency"
                    required
                    options={CURRENCY_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.currency?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="receiptTemplate"
                render={({ field }) => (
                  <Select
                    label="Default Fee Receipt Template"
                    hint="Used for printed receipts: office and student copies."
                    options={RECEIPT_TEMPLATE_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>
          </section>

          <section aria-labelledby="fee-receipt-numbering" className="grid gap-4">
            <SettingsSectionHeading id="fee-receipt-numbering" icon={ReceiptIcon}>
              Fee receipt numbering
            </SettingsSectionHeading>
            <SequencePreview name="feeReceipt" today={today} />
            <SequenceFields
              name="feeReceipt"
              prefixLabel="Receipt Prefix"
              prefixHint={prefixHint}
              prefixPlaceholder="e.g. SPS"
              today={today}
            >
              <DatedSequenceFields
                name="feeReceipt"
                dateLabel="Include Payment Date"
                nextLabel="Next Receipt Number"
                nextHint="Goes up by one with each payment."
                today={today}
              />
            </SequenceFields>
          </section>

          <section aria-labelledby="admission-numbering" className="grid gap-4">
            <SettingsSectionHeading id="admission-numbering" icon={IdentificationCardIcon}>
              Student admission numbering
            </SettingsSectionHeading>
            <SequencePreview name="admission" today={today} tone="success" />
            <SequenceFields
              name="admission"
              prefixLabel="Admission Prefix"
              prefixHint="Use a prefix unique to your school; your school code works well."
              prefixPlaceholder="e.g. SPS"
              today={today}
            >
              <DatedSequenceFields
                name="admission"
                dateLabel="Include Year"
                nextLabel="Next Admission Number"
                nextHint="Goes up by one with each new admission."
                today={today}
              />
            </SequenceFields>
          </section>

          <section aria-labelledby="roll-numbering" className="grid gap-4">
            <SettingsSectionHeading id="roll-numbering" icon={ListNumbersIcon}>
              Roll number formatting
            </SettingsSectionHeading>
            <SequencePreview name="roll" today={today} />
            <SequenceFields
              name="roll"
              prefixLabel="Roll Prefix"
              prefixHint={prefixHint}
              prefixPlaceholder="e.g. ROLL"
              today={today}
            />
            <Alert title="Roll numbers count up separately within each class and section." />
          </section>
        </div>

        <SettingsFormFooter
          isDirty={isDirty}
          isSubmitting={isSubmitting}
          onDiscard={() => reset(settings)}
        />
      </form>
    </FormProvider>
  )
}
