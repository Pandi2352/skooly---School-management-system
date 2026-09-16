import { zodResolver } from '@hookform/resolvers/zod'
import { FloppyDiskIcon } from '@phosphor-icons/react'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { CHANNEL_OPTIONS } from '../constants'
import { useUpdateBackupSchedule } from '../hooks/useBackupSchedule'
import { backupScheduleSchema } from '../schemas/backup.schema'
import type { BackupSchedule } from '../types/backup.types'

type SchedulingFormProps = {
  schedule: BackupSchedule
  onDone: () => void
}

export function SchedulingForm({ schedule, onDone }: SchedulingFormProps) {
  const channelsErrorId = useId()
  const { toast } = useToast()
  const updateSchedule = useUpdateBackupSchedule()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<BackupSchedule>({
    resolver: zodResolver(backupScheduleSchema),
    defaultValues: schedule,
  })
  const channelsError = errors.dailySummary?.channels?.message

  const submit = handleSubmit(async (values) => {
    try {
      await updateSchedule.mutateAsync(values)
      toast({
        title: 'Preferences saved',
        description: 'Saved for this session only. Sample data resets when the page reloads.',
      })
      onDone()
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t save the preferences',
        description: getErrorMessage(error),
      })
    }
  })

  return (
    <form
      noValidate
      aria-label="Automation and scheduling"
      onSubmit={(event) => void submit(event)}
    >
      <div className="grid gap-4">
        <div className="grid gap-3 rounded-md border border-line p-4">
          <Controller
            control={control}
            name="dailySummary.enabled"
            render={({ field }) => (
              <Switch
                label="Automated Daily Summary"
                hint="A short report each day: attendance, fees collected, income and expenses."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Preferred Time"
              type="time"
              error={errors.dailySummary?.time?.message}
              {...register('dailySummary.time')}
            />
            <Controller
              control={control}
              name="dailySummary.channels"
              render={({ field }) => (
                <fieldset aria-describedby={channelsError ? channelsErrorId : undefined}>
                  <legend className="text-sm font-bold text-ink">Delivery Channels</legend>
                  <div className="flex flex-wrap gap-x-5">
                    {CHANNEL_OPTIONS.map((option) => (
                      <Checkbox
                        key={option.value}
                        label={option.label}
                        checked={field.value.includes(option.value)}
                        onCheckedChange={(checked) =>
                          field.onChange(
                            checked === true
                              ? [...field.value, option.value]
                              : field.value.filter((channel) => channel !== option.value),
                          )
                        }
                      />
                    ))}
                  </div>
                  {channelsError && (
                    <p id={channelsErrorId} className="text-sm font-semibold text-danger">
                      {channelsError}
                    </p>
                  )}
                </fieldset>
              )}
            />
          </div>
        </div>

        <div className="grid gap-3 rounded-md border border-line p-4">
          <Controller
            control={control}
            name="scheduledBackups.enabled"
            render={({ field }) => (
              <Switch
                label="Scheduled System Backups"
                hint="Creates a full backup of the database and uploaded files every night."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <div className="sm:w-1/2 sm:pe-2">
            <Input
              label="Execution Time"
              type="time"
              error={errors.scheduledBackups?.time?.message}
              {...register('scheduledBackups.time')}
            />
          </div>
        </div>
      </div>

      <div className="-mx-5 mt-5 -mb-5 flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">
        <Button variant="secondary" disabled={isSubmitting} onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          {!isSubmitting && <FloppyDiskIcon className="size-4.5" aria-hidden="true" />}
          Save Preferences
        </Button>
      </div>
    </form>
  )
}
