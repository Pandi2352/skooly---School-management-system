import { PlusIcon, type Icon } from '@phosphor-icons/react'

type LibraryItemButtonProps = { label: string; icon: Icon; onClick: () => void }

/** One row in the designer library; clicking adds the item to the middle of the card. */
export function LibraryItemButton({ label, icon: ItemIcon, onClick }: LibraryItemButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-9 w-full cursor-pointer items-center gap-2.5 rounded-md border border-line bg-surface px-2.5 text-start text-sm text-ink hover:border-primary/40 hover:bg-primary/5 pointer-coarse:min-h-11"
    >
      <ItemIcon className="size-4 flex-none text-primary" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">
        <span className="sr-only">Add </span>
        {label}
      </span>
      <PlusIcon className="size-4 flex-none text-ink-muted" weight="bold" aria-hidden="true" />
    </button>
  )
}
