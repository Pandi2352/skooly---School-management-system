/** Trims and collapses inner whitespace: "  Asha   Menon " to "Asha Menon". */
export function cleanFullName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

/**
 * The key an email is matched on. Email domains are case-insensitive, and in practice mailboxes are
 * too, so "Asha.Menon@School.in" and "asha.menon@school.in" must not become two accounts.
 */
export function emailKey(email: string): string {
  return email.trim().toLocaleLowerCase('en')
}

/** Keeps the email as typed, minus stray spaces, so it is shown back the way the person wrote it. */
export function cleanEmail(email: string): string {
  return email.trim()
}

/** Digits and a single leading +, so "+91 98765 43210" and "+919876543210" compare equal. */
export function cleanPhone(phone: string): string {
  return phone.trim().replace(/[\s-]+/g, ' ')
}

/**
 * A short, readable description of the browser for the sessions list. User-agent strings are long
 * and easy to fake, so this is a hint for the person reading it, never something to rely on.
 */
export function describeUserAgent(userAgent: string): string {
  const browser =
    /\bEdg\//.test(userAgent) ? 'Edge'
    : /\bOPR\//.test(userAgent) ? 'Opera'
    : /\bFirefox\//.test(userAgent) ? 'Firefox'
    : /\bChrome\//.test(userAgent) ? 'Chrome'
    : /\bSafari\//.test(userAgent) ? 'Safari'
    : null
  const platform =
    /\bAndroid\b/.test(userAgent) ? 'Android'
    : /\b(iPhone|iPad|iOS)\b/.test(userAgent) ? 'iOS'
    : /\bWindows\b/.test(userAgent) ? 'Windows'
    : /\bMac OS X\b/.test(userAgent) ? 'macOS'
    : /\bLinux\b/.test(userAgent) ? 'Linux'
    : null
  if (browser && platform) return `${browser} on ${platform}`
  return browser ?? platform ?? 'Unknown device'
}
