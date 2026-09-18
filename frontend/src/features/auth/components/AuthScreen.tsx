import type { ReactNode } from 'react'
import { useBranding } from '@/features/branding/hooks/useBranding'

type AuthScreenProps = {
  title: string
  description?: ReactNode
  children: ReactNode
  /** A link or note under the card, such as "Back to sign in". */
  footer?: ReactNode
}

/**
 * The plain, centred screen behind first-run setup, invitation links and password resets. The sign-in
 * page keeps its own full-width design; these are short, one-task pages, so the card is the page.
 */
export function AuthScreen({ title, description, children, footer }: AuthScreenProps) {
  const branding = useBranding()
  const schoolName = branding.data?.displayName ?? 'Skooly'
  const logoUrl = branding.data?.assets.logo?.url ?? '/skooly-logo.jpg'

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 py-10">
      <title>{`${title} · ${schoolName}`}</title>
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <img src={logoUrl} alt="" className="size-10 rounded-md object-cover ring-1 ring-line" />
          <span className="text-lg font-bold tracking-tight text-ink">{schoolName}</span>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 sm:p-7">
          <h1 className="text-xl font-bold tracking-tight text-ink">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-ink-muted">{description}</p>}
          <div className="mt-5">{children}</div>
        </div>

        {footer && <div className="mt-4 text-center text-sm text-ink-muted">{footer}</div>}
      </div>
    </div>
  )
}
