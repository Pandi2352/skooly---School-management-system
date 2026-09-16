import { Spinner } from '@/components/ui/Spinner'

/** `label` names what is loading: "Loading students". */
export function LoadingState({ label }: { label: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 px-4 py-12 text-ink-muted">
      <Spinner />
      <span>{label}…</span>
    </div>
  )
}
