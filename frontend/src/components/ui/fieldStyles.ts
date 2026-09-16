// Shared label and description wiring for form controls.

export function fieldLabelClasses(hidden: boolean) {
  return hidden ? 'sr-only' : 'text-sm font-bold text-ink'
}

export function fieldDescribedBy(id: string, hint?: string, error?: string) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}
