import { zodResolver } from '@hookform/resolvers/zod'
import { IdentificationCardIcon } from '@phosphor-icons/react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/lib/api/ApiError'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { BRANDING_LIMITS } from '../constants'
import { useUpdateBranding } from '../hooks/useBranding'
import { brandingIdentitySchema } from '../schemas/branding.schema'
import type { Branding, BrandingIdentityValues } from '../types/branding.types'
import { BrandingAssetsSection } from './BrandingAssetsSection'
import { BrandingColorTheme } from './BrandingColorTheme'
import { BrandingPreview } from './BrandingPreview'

const identityFields: (keyof BrandingIdentityValues)[] = ['displayName', 'shortName', 'tagline', 'documentFooter']

const toIdentityValues = (branding: Branding): BrandingIdentityValues => ({
  displayName: branding.displayName,
  shortName: branding.shortName,
  tagline: branding.tagline,
  documentFooter: branding.documentFooter,
})

const isIdentityField = (field: string): field is keyof BrandingIdentityValues =>
  identityFields.some((name) => name === field)

/** Name and wording (saved with Save), colour and images (each saved on change), and a live preview. */
export function BrandingEditor({ branding }: { branding: Branding }) {
  const { toast } = useToast()
  const update = useUpdateBranding()
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<BrandingIdentityValues>({
    resolver: zodResolver(brandingIdentitySchema),
    defaultValues: toIdentityValues(branding),
  })
  const watched = useWatch({ control })
  const draft: BrandingIdentityValues = { ...toIdentityValues(branding), ...watched }

  const save = handleSubmit(async (values) => {
    try {
      const saved = await update.mutateAsync(values)
      reset(toIdentityValues(saved))
      toast.success('Branding saved', 'The name and wording are updated across the app.')
    } catch (error) {
      // Show the server's field messages next to the fields they belong to.
      if (error instanceof ApiError) {
        for (const fieldError of error.fieldErrors) {
          if (isIdentityField(fieldError.field)) setError(fieldError.field, { message: fieldError.message })
        }
      }
      toast.error('Couldn’t save branding', getErrorMessage(error))
    }
  })

  const counter = (value: string, max: number) => `${String(value.length)}/${String(max)}`

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="@container grid min-w-0 gap-5">
        <form
          noValidate
          aria-label="School name and wording"
          onSubmit={(event) => void save(event)}
          className="rounded-md border border-line bg-surface"
        >
          <div className="grid gap-4 p-4 @xl:p-5">
            <SectionHeading id="branding-identity" icon={IdentificationCardIcon}>
              Name & wording
            </SectionHeading>
            <div className="grid gap-x-4 gap-y-3.5 @2xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Input
                label="Display Name"
                required
                autoComplete="organization"
                placeholder="e.g. Green Valley Public School"
                hint={`How the name appears in the app, on the login page and on documents. ${counter(draft.displayName, BRANDING_LIMITS.displayNameMax)}`}
                maxLength={BRANDING_LIMITS.displayNameMax}
                error={errors.displayName?.message}
                {...register('displayName')}
              />
              <Input
                label="Short Name"
                autoComplete="off"
                placeholder="e.g. GVPS"
                hint={`For tight spaces such as SMS and ID cards. ${counter(draft.shortName, BRANDING_LIMITS.shortNameMax)}`}
                maxLength={BRANDING_LIMITS.shortNameMax}
                error={errors.shortName?.message}
                {...register('shortName')}
              />
            </div>
            <Input
              label="Tagline"
              autoComplete="off"
              placeholder="e.g. Learning with purpose"
              hint={`The motto or line under the name. ${counter(draft.tagline, BRANDING_LIMITS.taglineMax)}`}
              maxLength={BRANDING_LIMITS.taglineMax}
              error={errors.tagline?.message}
              {...register('tagline')}
            />
            <Textarea
              label="Document Footer"
              rows={2}
              placeholder="e.g. Affiliated to CBSE, New Delhi · Affiliation No. 1234567"
              hint={`Printed at the bottom of receipts and certificates. ${counter(draft.documentFooter, BRANDING_LIMITS.documentFooterMax)}`}
              maxLength={BRANDING_LIMITS.documentFooterMax}
              error={errors.documentFooter?.message}
              {...register('documentFooter')}
            />
          </div>
          <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 rounded-b-md border-t border-line bg-surface px-4 py-3 @xl:px-5">
            {isDirty && (
              <span className="me-auto text-sm font-semibold text-status-ink" aria-live="polite">
                Unsaved changes
              </span>
            )}
            <Button variant="secondary" disabled={!isDirty || isSubmitting} onClick={() => reset(toIdentityValues(branding))}>
              Discard
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
              Save
            </Button>
          </div>
        </form>

        <BrandingColorTheme branding={branding} />
        <BrandingAssetsSection branding={branding} />
      </div>

      <aside className="min-w-0 xl:sticky xl:top-[calc(var(--spacing-navbar)+1.25rem)]">
        <BrandingPreview branding={branding} draft={draft} />
      </aside>
    </div>
  )
}
