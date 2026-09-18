import { zodResolver } from '@hookform/resolvers/zod'
import { InfoIcon, PaintBrushIcon } from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { COUNTRY_OPTIONS } from '../constants'
import { useUpdateSchoolProfile } from '../hooks/useSchoolProfile'
import { schoolProfileSchema } from '../schemas/schoolProfile.schema'
import type { SchoolProfile } from '../types/settings.types'
import { SettingsFormFooter } from './SettingsFormFooter'
import { SectionHeading as SettingsSectionHeading } from '@/components/ui/SectionHeading'

export function SchoolProfileForm({ profile }: { profile: SchoolProfile }) {
  const { toast } = useToast()
  const updateProfile = useUpdateSchoolProfile()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SchoolProfile>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: profile,
  })

  const submit = handleSubmit(async (values) => {
    try {
      const saved = await updateProfile.mutateAsync(values)
      reset(saved)
      toast({
        title: 'School profile saved',
        description: 'Saved for this session only. Sample data resets when the page reloads.',
      })
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t save the school profile',
        description: getErrorMessage(error),
      })
    }
  })

  return (
    <form noValidate aria-label="School profile" onSubmit={(event) => void submit(event)}>
      <div className="grid gap-7 p-4 sm:p-5">
        <section aria-labelledby="general-information" className="grid gap-4">
          <SettingsSectionHeading id="general-information" icon={InfoIcon}>
            General information
          </SettingsSectionHeading>
          <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
            <Input
              label="School Name"
              required
              autoComplete="organization"
              placeholder="e.g. Green Valley Public School"
              error={errors.schoolName?.message}
              {...register('schoolName')}
            />
            <Input
              label="Short Name / Acronym"
              placeholder="e.g. GVPS"
              maxLength={10}
              error={errors.shortName?.message}
              {...register('shortName')}
            />
            <Input
              label="School Email"
              type="email"
              required
              autoComplete="email"
              placeholder="e.g. office@yourschool.in"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Phone Number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="e.g. +91 98765 43210"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Principal Name"
              autoComplete="name"
              placeholder="e.g. Dr. Meera Iyer"
              error={errors.principalName?.message}
              {...register('principalName')}
            />
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <Select
                  label="Country"
                  options={COUNTRY_OPTIONS}
                  placeholder="Choose a country"
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.country?.message}
                />
              )}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Address"
                rows={2}
                autoComplete="street-address"
                placeholder="Building, street, area, city, state and PIN code"
                error={errors.address?.message}
                {...register('address')}
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="branding-appearance" className="grid gap-3">
          <SettingsSectionHeading id="branding-appearance" icon={PaintBrushIcon}>
            Branding & appearance
          </SettingsSectionHeading>
          <p className="text-sm text-ink-muted">
            The logo, favicon, principal signature, school seal, login image and colour theme are managed on the
            Branding page, with a preview of where each one appears.{' '}
            <Link to={paths.settingsBranding} className="font-semibold text-primary underline underline-offset-2">
              Open Branding
            </Link>
          </p>
        </section>
      </div>

      <SettingsFormFooter
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onDiscard={() => reset(profile)}
      />
    </form>
  )
}
