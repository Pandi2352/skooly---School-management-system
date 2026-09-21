import { CUSTOM_FIELD_LIMITS } from '../constants/custom-field.constants'

/** Trims and collapses inner whitespace: "  Birth   marks " to "Birth marks". */
export function cleanLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ')
}

/** Case-insensitive uniqueness key, so a school can't add the same question twice. */
export function labelKeyOf(label: string): string {
  return cleanLabel(label).toLocaleLowerCase('en')
}

/**
 * The name answers are saved under: "Birth marks" becomes "birth_marks". Derived from the first
 * label only — renaming the question later must not move where past answers live.
 */
export function baseKeyFrom(label: string): string {
  const key = cleanLabel(label)
    .toLocaleLowerCase('en')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, CUSTOM_FIELD_LIMITS.keyMax)
  // A label of only punctuation or non-Latin script leaves nothing usable.
  return /^[a-z]/.test(key) ? key : `field_${key}`.slice(0, CUSTOM_FIELD_LIMITS.keyMax)
}

/** Adds _2, _3… until the key is free on this form. */
export function uniqueKey(label: string, takenKeys: string[]): string {
  const base = baseKeyFrom(label)
  if (!takenKeys.includes(base)) return base
  for (let suffix = 2; ; suffix += 1) {
    const candidate = `${base}_${String(suffix)}`.slice(0, CUSTOM_FIELD_LIMITS.keyMax)
    if (!takenKeys.includes(candidate)) return candidate
  }
}

/** Removes blanks and repeats, keeping the order the school typed. */
export function cleanOptions(options: string[]): string[] {
  return [...new Set(options.map((option) => option.trim()).filter((option) => option !== ''))]
}
