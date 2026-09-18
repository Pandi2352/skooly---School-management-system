import { EyeIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { DEFAULT_FAVICON_HREF, PLACEHOLDER_SCHOOL_NAME } from '../constants'
import type { Branding, BrandingIdentityValues } from '../types/branding.types'
import { schoolInitials } from '../utils/brandingAssets'

type BrandingPreviewProps = {
  branding: Branding
  /** Current form text, so the preview shows unsaved typing too. */
  draft: BrandingIdentityValues
}

function LogoMark({ url, name, className }: { url: string | undefined; name: string; className: string }) {
  return url ? (
    <img src={url} alt="" className={cn('object-contain', className)} />
  ) : (
    <span
      aria-hidden="true"
      className={cn('grid place-items-center rounded-full bg-primary font-bold text-surface', className)}
    >
      {schoolInitials(name) || 'S'}
    </span>
  )
}

/**
 * Where the branding shows: browser tab, app header, login page and a printed document header.
 * Documents always print on white paper, so that mock uses fixed print colours instead of theme tokens.
 */
export function BrandingPreview({ branding, draft }: BrandingPreviewProps) {
  const name = draft.displayName.trim() || PLACEHOLDER_SCHOOL_NAME
  const { logo, favicon, principalSignature, schoolSeal, loginBackground } = branding.assets

  return (
    <section aria-labelledby="branding-preview" className="grid gap-4 rounded-md border border-line bg-surface p-4">
      <div className="grid gap-0.5">
        <h2 id="branding-preview" className="flex items-center gap-2 font-bold text-ink">
          <EyeIcon className="size-5 text-primary" weight="fill" aria-hidden="true" />
          Preview
        </h2>
        <p className="text-sm text-ink-muted">Unsaved text changes show here too.</p>
      </div>

      <figure className="grid gap-1.5">
        <figcaption className="text-xs font-bold tracking-wide text-ink-muted uppercase">Browser tab</figcaption>
        <div className="flex items-end border-b border-line bg-canvas px-2 pt-2">
          <div className="flex max-w-full min-w-0 items-center gap-2 rounded-t-md border border-b-0 border-line bg-surface px-3 py-1.5">
            <img src={favicon?.url ?? DEFAULT_FAVICON_HREF} alt="" className="size-4 flex-none rounded-sm object-contain" />
            <span className="truncate text-xs text-ink">{name}</span>
          </div>
        </div>
      </figure>

      <figure className="grid gap-1.5">
        <figcaption className="text-xs font-bold tracking-wide text-ink-muted uppercase">App header</figcaption>
        <div className="flex items-center gap-2.5 rounded-md bg-side px-3 py-2.5 text-side-ink">
          <LogoMark url={logo?.url} name={name} className="size-9 flex-none text-xs" />
          <div className="grid min-w-0">
            <span className="truncate text-sm font-semibold">{draft.shortName.trim() || name}</span>
            {draft.tagline.trim() && <span className="truncate text-xs text-side-muted">{draft.tagline.trim()}</span>}
          </div>
        </div>
      </figure>

      <figure className="grid gap-1.5">
        <figcaption className="text-xs font-bold tracking-wide text-ink-muted uppercase">Login page</figcaption>
        <div
          className={cn('grid h-32 place-items-center overflow-hidden rounded-md bg-side bg-cover bg-center p-3')}
          // The background image is the school's own upload, so it's set from data.
          style={loginBackground ? { backgroundImage: `url("${loginBackground.url}")` } : undefined}
        >
          <div className="grid w-44 justify-items-center gap-1 rounded-md bg-surface px-3 py-2.5 text-center shadow-lg">
            <LogoMark url={logo?.url} name={name} className="size-8 text-xs" />
            <span className="line-clamp-2 text-xs font-semibold text-ink">{name}</span>
            <span className="h-1.5 w-full rounded-full bg-line" aria-hidden="true" />
            <span className="h-4 w-full rounded-sm bg-primary" aria-hidden="true" />
          </div>
        </div>
      </figure>

      <figure className="grid gap-1.5">
        <figcaption className="text-xs font-bold tracking-wide text-ink-muted uppercase">Printed document</figcaption>
        <div className="grid gap-2 rounded-md border border-line bg-[#ffffff] p-3 text-[#1a2233] shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#d8dce3] pb-2">
            <LogoMark url={logo?.url} name={name} className="size-10 flex-none text-xs" />
            <div className="grid min-w-0 text-center">
              <span className="text-sm leading-tight font-bold">{name}</span>
              {draft.tagline.trim() && <span className="text-[0.6875rem] text-[#525c6b]">{draft.tagline.trim()}</span>}
            </div>
          </div>
          <div className="grid gap-1" aria-hidden="true">
            <span className="h-1.5 w-full rounded-full bg-[#e8eef6]" />
            <span className="h-1.5 w-4/5 rounded-full bg-[#e8eef6]" />
            <span className="h-1.5 w-3/5 rounded-full bg-[#e8eef6]" />
          </div>
          <div className="flex items-end justify-between gap-2 pt-1">
            {schoolSeal ? (
              <img src={schoolSeal.url} alt="" className="size-10 object-contain opacity-90" />
            ) : (
              <span className="grid size-10 place-items-center rounded-full border border-dashed border-[#94a3b8] text-[0.5rem] text-[#525c6b]">
                Seal
              </span>
            )}
            <div className="grid justify-items-center gap-0.5">
              {principalSignature ? (
                <img src={principalSignature.url} alt="" className="h-6 max-w-24 object-contain" />
              ) : (
                <span className="h-6" />
              )}
              <span className="w-20 border-t border-[#1a2233] pt-0.5 text-center text-[0.5625rem]">Principal</span>
            </div>
          </div>
          {draft.documentFooter.trim() && (
            <p className="border-t border-[#d8dce3] pt-1.5 text-center text-[0.625rem] text-[#525c6b]">
              {draft.documentFooter.trim()}
            </p>
          )}
        </div>
      </figure>
    </section>
  )
}
