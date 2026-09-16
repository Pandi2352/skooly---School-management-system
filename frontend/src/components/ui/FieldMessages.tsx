/** Hint and error text under a form control; ids match `fieldDescribedBy`. */
export function FieldMessages({ id, hint, error }: { id: string; hint?: string; error?: string }) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </>
  )
}
