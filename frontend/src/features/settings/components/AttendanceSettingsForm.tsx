import { zodResolver } from '@hookform/resolvers/zod'
import { BellIcon, ClockIcon, SlidersHorizontalIcon } from '@phosphor-icons/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { SectionHeading as SettingsSectionHeading } from '@/components/ui/SectionHeading'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import {
  ATTENDANCE_TRACKING_OPTIONS,
  SATURDAY_RULE_OPTIONS,
  WEEKDAY_OPTIONS,
} from '../constants'
import { useUpdateAttendanceSettings } from '../hooks/useAttendanceSettings'
import {
  attendanceSettingsSchema,
  type AttendanceSettingsFormData,
} from '../schemas/attendanceSettings.schema'
import type { AttendanceSettings } from '../types/settings.types'
import { SettingsFormFooter } from './SettingsFormFooter'

export function AttendanceSettingsForm({ attendance }: { attendance: AttendanceSettings }) {
  const { toast } = useToast()
  const updateAttendance = useUpdateAttendanceSettings()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AttendanceSettingsFormData>({
    resolver: zodResolver(attendanceSettingsSchema),
    defaultValues: attendance,
  })

  const notifyAbsence = useWatch({ control, name: 'notifyAbsenceToParents' })

  const submit = handleSubmit(async (values) => {
    try {
      const saved = await updateAttendance.mutateAsync(values)
      reset(saved)
      toast({
        title: 'Attendance settings saved',
        description: 'Tracking schedule, check-in cutoffs, and absence alerts updated.',
      })
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t save attendance settings',
        description: getErrorMessage(error),
      })
    }
  })

  return (
    <form noValidate aria-label="Attendance settings" onSubmit={(event) => void submit(event)}>
      <div className="grid gap-7 p-4 sm:p-5">
        <section aria-labelledby="tracking-mode-heading" className="grid gap-4">
          <SettingsSectionHeading id="tracking-mode-heading" icon={ClockIcon}>
            Attendance Mode & Schedule
          </SettingsSectionHeading>

          <div className="rounded-md border border-line bg-canvas/60 p-4">
            <Controller
              name="trackingMode"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Recording Frequency"
                  options={ATTENDANCE_TRACKING_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                    description: opt.description,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.trackingMode?.message}
                />
              )}
            />
          </div>

          <div className="grid gap-3 rounded-md border border-line bg-canvas/60 p-4">
            <span className="text-sm font-medium text-ink">Operational Working Days</span>
            <p className="text-sm text-ink-muted">
              Select which weekdays the school conducts regular classes.
            </p>
            <Controller
              name="workingDays"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {WEEKDAY_OPTIONS.map((day) => {
                    const isChecked = field.value.includes(day.value)
                    return (
                      <Checkbox
                        key={day.value}
                        id={`day-${day.value}`}
                        label={day.label}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const current = field.value
                          if (checked) {
                            if (!current.includes(day.value)) {
                              field.onChange([...current, day.value])
                            }
                          } else {
                            field.onChange(current.filter((d) => d !== day.value))
                          }
                        }}
                      />
                    )
                  })}
                </div>
              )}
            />
            {errors.workingDays?.message && (
              <p role="alert" className="text-xs text-danger">
                {errors.workingDays.message}
              </p>
            )}
          </div>

          <div className="max-w-md">
            <Controller
              name="saturdayRule"
              control={control}
              render={({ field }) => (
                <Select
                  label="Saturday Working Policy"
                  options={SATURDAY_RULE_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.saturdayRule?.message}
                />
              )}
            />
          </div>
        </section>

        <section aria-labelledby="timings-thresholds-heading" className="grid gap-4">
          <SettingsSectionHeading id="timings-thresholds-heading" icon={SlidersHorizontalIcon}>
            Timings & Thresholds
          </SettingsSectionHeading>

          <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
            <Input
              label="Morning Check-In Time (HH:mm)"
              placeholder="08:30"
              required
              hint="Official school arrival cutoff time"
              error={errors.checkInTime?.message}
              {...register('checkInTime')}
            />

            <Input
              label="Late Grace Period (minutes)"
              type="number"
              min={0}
              max={60}
              required
              hint="Minutes after check-in before marked 'Late'"
              error={errors.lateThresholdMinutes?.message}
              {...register('lateThresholdMinutes', { valueAsNumber: true })}
            />

            <Input
              label="Half-Day Minimum Hours"
              type="number"
              step="0.5"
              min={1}
              max={8}
              required
              hint="Hours attended required for half-day credit"
              error={errors.halfDayThresholdHours?.message}
              {...register('halfDayThresholdHours', { valueAsNumber: true })}
            />

            <Input
              label="Minimum Attendance Requirement (%)"
              type="number"
              min={50}
              max={100}
              required
              hint="Annual percentage required for academic eligibility"
              error={errors.minimumAttendancePercentage?.message}
              {...register('minimumAttendancePercentage', { valueAsNumber: true })}
            />
          </div>
        </section>

        <section aria-labelledby="absence-notifications-heading" className="grid gap-4">
          <SettingsSectionHeading id="absence-notifications-heading" icon={BellIcon}>
            Absence Alerts & Notifications
          </SettingsSectionHeading>

          <div className="rounded-md border border-line bg-canvas/60 p-4">
            <Controller
              name="notifyAbsenceToParents"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="notifyAbsenceToParents"
                  label="Dispatch absence alerts to parents / guardians"
                  hint="Sends an automated SMS or WhatsApp notification when a student is recorded absent without prior leave."
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              )}
            />
          </div>

          <div className="max-w-xs">
            <Input
              label="Notification Dispatch Time (HH:mm)"
              placeholder="10:00"
              required
              disabled={!notifyAbsence}
              hint="Time when absence alerts are sent out"
              error={errors.absenceNotificationTime?.message}
              {...register('absenceNotificationTime')}
            />
          </div>
        </section>
      </div>

      <SettingsFormFooter
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onDiscard={() => reset(attendance)}
      />
    </form>
  )
}
