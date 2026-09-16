import { MagicWandIcon } from '@phosphor-icons/react'

type AutoFillButtonProps = {
  /** Read after "Auto" by screen readers: "fill the next admission number". */
  purpose: string
  disabled: boolean
  onClick: () => void
}

/** The "Auto" button joined to the right of a field (Input's `endAddon`). */
export function AutoFillButton({ purpose, disabled, onClick }: AutoFillButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-10 flex-none cursor-pointer items-center gap-1.5 rounded-e-md border border-s-0 border-field bg-canvas px-3 text-sm font-semibold text-ink hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60 pointer-coarse:h-11"
    >
      <MagicWandIcon className="size-4" weight="fill" aria-hidden="true" />
      Auto
      <span className="sr-only">: {purpose}</span>
    </button>
  )
}
