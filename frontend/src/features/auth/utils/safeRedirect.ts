/** Written as a constant because a lone backslash inside a check is easy to misread. */
const BACKSLASH = '\\'

/**
 * Where to go after signing in. The destination arrives in the URL (`/login?next=…`), so it is
 * attacker-controlled: without this check a link like `/login?next=https://evil.example` would send
 * someone off the school's site carrying the sign-in page's authority.
 *
 * Only a plain in-app path is accepted: one leading slash, no scheme, no `//host` shorthand, and no
 * backslashes, which some browsers read as slashes.
 */
export function safeRedirect(next: string | null, fallback: string): string {
  if (!next) return fallback
  const path = next.trim()
  if (!path.startsWith('/')) return fallback
  if (path.startsWith('//')) return fallback
  if (path.includes(BACKSLASH)) return fallback
  // A colon before the first slash would let "javascript:" or "https:" through the checks above.
  if (/^\/[^/?#]*:/.test(path)) return fallback
  return path
}
