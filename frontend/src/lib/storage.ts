// localStorage throws in some browsers (private mode, blocked site data),
// so every read and write goes through these helpers.

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Not saved; the value still applies for this visit.
  }
}

export function removeStorage(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Nothing stored if storage is unavailable.
  }
}
