import { GlobeIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/format'
import type { AdmissionSettings } from '../types/admissionSettings.types'

const SUMMARY_LABELS = { unset: 'Not set yet' } as const

/**
 * What families would see: the address, the session and what applying costs.
 *
 * The public form itself isn't built, so the server answers `publicPageLive: false` and this card
 * shows the address as reserved rather than offering a link, a QR code or a card to hand out — a
 * printed code pointing at nothing is worse than none.
 */
export function PublicLinkCard({
  settings,
  draftSlug,
}: {
  settings: AdmissionSettings
  /** The slug as currently typed, so the address updates before Save. */
  draftSlug: string
}) {
  // The server builds the saved address from its own app URL; until a slug is saved there is none
  // to take it from, so the browser's own origin stands in while the school is still typing.
  const base =
    settings.publicUrl === ''
      ? `${window.location.origin}/admission`
      : settings.publicUrl.slice(0, settings.publicUrl.lastIndexOf('/'))
  const address = draftSlug === '' ? '' : `${base}/${draftSlug}`
  const unsaved = draftSlug !== settings.publicSlug

  return (
    <aside className="grid content-start gap-4 rounded-md border border-line bg-surface p-4 xl:p-5">
      <div className="flex items-center gap-2.5">
        <GlobeIcon className="size-5 flex-none text-primary" weight="fill" aria-hidden="true" />
        <h2 className="text-base font-semibold text-ink">Public admission form</h2>
      </div>

      <div className="grid gap-1.5">
        <span className="text-sm font-semibold text-ink">Address</span>
        <p className="rounded-md border border-line bg-canvas px-3 py-2 font-mono text-sm wrap-anywhere text-ink">
          {address === '' ? SUMMARY_LABELS.unset : address}
        </p>
        {unsaved && address !== '' && (
          <p className="text-sm text-ink-muted" aria-live="polite">
            Save to reserve this address.
          </p>
        )}
      </div>

      <dl className="grid gap-2 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-muted">Applications</dt>
          <dd>
            <Badge tone={settings.admissionsOpen ? 'success' : 'neutral'}>
              {settings.admissionsOpen ? 'Open' : 'Closed'}
            </Badge>
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-muted">Session</dt>
          <dd className="font-semibold text-ink">{settings.sessionLabel || SUMMARY_LABELS.unset}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-muted">Fee</dt>
          <dd className="font-semibold text-ink">
            {settings.feeEnabled ? formatCurrency(settings.feeAmount) : 'Free to apply'}
          </dd>
        </div>
      </dl>

      <div
        hidden={settings.publicPageLive}
        className="rounded-md border border-status bg-status px-3 py-2.5 text-sm text-status-ink"
      >
        <p className="font-semibold">The form isn’t open to families yet</p>
        <p className="mt-0.5">
          These settings are saved and the address is reserved. The page families fill in — and the link,
          QR code and card you hand out — arrives with the public admission form.
        </p>
      </div>
    </aside>
  )
}
