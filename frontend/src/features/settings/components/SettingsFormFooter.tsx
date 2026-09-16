import { FloppyDiskIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

type SettingsFormFooterProps = {
  isDirty: boolean
  isSubmitting: boolean
  onDiscard: () => void
}

/** Save bar at the end of a settings form; it stays in view while a long form scrolls. */
export function SettingsFormFooter({ isDirty, isSubmitting, onDiscard }: SettingsFormFooterProps) {
  return (
    <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 rounded-b-md border-t border-line bg-surface px-4 py-3 sm:px-5">
      {isDirty && (
        <span className="me-auto text-sm text-ink-muted" aria-live="polite">
          You have unsaved changes
        </span>
      )}
      <Button variant="secondary" disabled={!isDirty || isSubmitting} onClick={onDiscard}>
        Discard changes
      </Button>
      <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
        <FloppyDiskIcon className="size-4.5" aria-hidden="true" />
        Save settings
      </Button>
    </div>
  )
}
