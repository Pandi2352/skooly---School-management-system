import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * Secrets that travel in a cookie or an email link. The raw value is shown once and never stored:
 * the database keeps only its SHA-256 hash, so a leaked database can't be used to sign in.
 * SHA-256 is right here (unlike for passwords) because the value is long and random already.
 */

export type GeneratedSecret = {
  /** Sent to the browser or the email link. */
  token: string
  /** Stored in the database. */
  tokenHash: string
}

export function generateSecretToken(byteLength = 32): GeneratedSecret {
  const token = randomBytes(byteLength).toString('base64url')
  return { token, tokenHash: hashSecretToken(token) }
}

export function hashSecretToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/** Compares two hashes in constant time, so timing can't reveal how much of a guess was right. */
export function secretHashesMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, 'utf8')
  const rightBuffer = Buffer.from(right, 'utf8')
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}
