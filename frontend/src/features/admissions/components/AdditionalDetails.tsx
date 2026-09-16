import { ListBulletsIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useCustomFields } from '@/features/customFields'
import { CustomFieldControl } from './CustomFieldControl'

/** The school's own questions (Settings → Custom Fields), shown in their saved order. */
export function AdditionalDetails() {
  const fields = useCustomFields()
  const shown = (fields.data ?? []).filter((field) => field.active)

  if (fields.isPending) return null
  if (fields.isError) {
    return (
      <p role="alert" className="text-sm font-semibold text-danger">
        Couldn’t load the additional details fields. Reload the page to try again.
      </p>
    )
  }
  if (shown.length === 0) return null

  return (
    <section aria-labelledby="additional-details-heading" className="grid gap-4">
      <SectionHeading id="additional-details-heading" icon={ListBulletsIcon}>
        Additional details
      </SectionHeading>
      <p className="text-sm text-ink-muted">
        Questions added by your school.{' '}
        <Link
          to={paths.settingsCustomFields}
          className="font-semibold text-primary underline underline-offset-2"
        >
          Manage custom fields
        </Link>
      </p>
      <div className="grid gap-x-4 gap-y-3.5 @xl:grid-cols-2">
        {shown.map((field) => (
          <CustomFieldControl key={field.id} field={field} />
        ))}
      </div>
    </section>
  )
}
