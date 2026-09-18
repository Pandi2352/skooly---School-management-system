const UNITS: [limitInMinutes: number, minutesPerUnit: number, name: string][] = [
  [60, 1, 'minute'],
  [60 * 24, 60, 'hour'],
  [60 * 24 * 7, 60 * 24, 'day'],
]

/**
 * Both readings of a moment: "12 minutes ago" answers "is this happening now?", and the exact time
 * answers "what happened at 3pm?". An audit trail is read for both, so it shows both.
 */
export function formatEventTime(at: string, now: Date = new Date()): { relative: string; absolute: string } {
  const when = new Date(at)
  const absolute = when.toLocaleString()
  // Whole minutes only: 30 seconds ago is "just now", not "1 minute ago".
  const minutesAgo = Math.max(0, Math.floor((now.getTime() - when.getTime()) / 60_000))

  if (minutesAgo < 1) return { relative: 'Just now', absolute }
  for (const [limit, perUnit, name] of UNITS) {
    if (minutesAgo < limit) {
      const value = Math.floor(minutesAgo / perUnit)
      return { relative: `${value} ${name}${value === 1 ? '' : 's'} ago`, absolute }
    }
  }
  return { relative: when.toLocaleDateString(), absolute }
}
