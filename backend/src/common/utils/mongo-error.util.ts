/** A MongoDB unique-index violation (E11000). */
export interface DuplicateKeyError {
  code: 11000
  keyValue?: Record<string, unknown>
}

export function isDuplicateKeyError(error: unknown): error is DuplicateKeyError {
  return typeof error === 'object' && error !== null && Reflect.get(error, 'code') === 11000
}

/** Escapes user text so it can be used inside a RegExp as a literal (no injection, no ReDoS). */
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
