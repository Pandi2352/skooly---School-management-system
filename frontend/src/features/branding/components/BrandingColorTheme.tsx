import { CheckCircleIcon, PaletteIcon } from '@phosphor-icons/react'
import { COLOR_THEMES, type ColorTheme } from '@/app/theme/themeContext'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useTheme } from '@/hooks/useTheme'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { cn } from '@/lib/cn'
import { useUpdateBranding } from '../hooks/useBranding'
import type { Branding } from '../types/branding.types'

/** The school's default brand colour. Saves on click. */
export function BrandingColorTheme({ branding }: { branding: Branding }) {
  const { toast } = useToast()
  const update = useUpdateBranding()
  const { usesSchoolColorTheme, followSchoolColorTheme } = useTheme()

  const choose = async (colorTheme: ColorTheme, label: string) => {
    if (colorTheme === branding.colorTheme || update.isPending) return
    try {
      await update.mutateAsync({ colorTheme })
      toast.success('Colour theme saved', `${label} is now the school’s default colour.`)
    } catch (error) {
      toast.error('Couldn’t save the colour theme', getErrorMessage(error))
    }
  }

  return (
    <section aria-labelledby="branding-colour" className="grid gap-4 rounded-md border border-line bg-surface p-4 @xl:p-5">
      <SectionHeading id="branding-colour" icon={PaletteIcon}>
        Colour theme
      </SectionHeading>
      <p className="text-sm text-ink-muted">
        The brand colour for buttons, links and headings, for everyone at the school. The sidebar stays navy.
      </p>

      {!usesSchoolColorTheme && (
        <Alert
          title="You’ve picked your own colour"
          action={
            <Button variant="secondary" size="sm" onClick={followSchoolColorTheme}>
              Use school default
            </Button>
          }
        >
          Changes here apply to everyone else; your screen keeps your choice from General settings.
        </Alert>
      )}

      <div role="group" aria-label="School colour theme" className="grid gap-3 @md:grid-cols-2">
        {COLOR_THEMES.map((option) => {
          const selected = option.value === branding.colorTheme
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              disabled={update.isPending}
              onClick={() => void choose(option.value, option.label)}
              className={cn(
                'grid cursor-pointer gap-3 rounded-md border p-3 text-start transition-colors disabled:cursor-wait motion-reduce:transition-none',
                selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-line hover:border-primary/40',
              )}
            >
              {/* Decorative sample of the colour on a button and a link. */}
              <span aria-hidden="true" className="flex items-center gap-2">
                <span className={cn('h-8 w-16 rounded-md', option.swatchClassName)} />
                <span className={cn('h-2 w-10 rounded-full opacity-60', option.swatchClassName)} />
                <span className={cn('h-2 w-6 rounded-full opacity-30', option.swatchClassName)} />
              </span>
              <span className="flex items-center justify-between gap-2">
                <span className="font-semibold text-ink">{option.label}</span>
                {selected && (
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <CheckCircleIcon className="size-4.5" weight="fill" aria-hidden="true" />
                    School default
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
