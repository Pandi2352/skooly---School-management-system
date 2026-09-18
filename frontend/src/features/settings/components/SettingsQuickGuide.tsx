import { BookOpenIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

const tips = [
  {
    term: 'Acronyms',
    detail: 'Short names (e.g. "SPS") fit where space is tight, such as SMS messages to parents.',
  },
  {
    term: 'Logo and images',
    detail:
      'Upload the logo, favicon, principal signature and school seal on the Branding page (Settings & Billing → Branding). It shows the size each one needs.',
  },
]

export function SettingsQuickGuide({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="settings-quick-guide"
      className={cn('rounded-md border-t-4 border-primary bg-surface p-4 shadow-sm', className)}
    >
      <h2
        id="settings-quick-guide"
        className="flex items-center gap-2 text-lg font-bold text-primary"
      >
        <BookOpenIcon className="size-5.5" weight="fill" aria-hidden="true" />
        Quick Guide
      </h2>
      <div className="mt-3 grid gap-1.5 text-sm leading-relaxed text-ink-muted">
        {tips.map((tip) => (
          <p key={tip.term}>
            <strong className="font-bold text-ink">{tip.term}:</strong> {tip.detail}
          </p>
        ))}
      </div>
    </section>
  )
}
