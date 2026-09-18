import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

/**
 * Encrypts a secret that has to be readable again later — a two-step sign-in seed, which must be
 * used to check codes and so cannot be hashed like a password.
 *
 * AES-256-GCM: the ciphertext can't be read without the key, and it can't be altered without the
 * check failing. The key lives in the environment, never in the database, so a stolen database is
 * not enough to generate anyone's codes.
 */

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const VERSION = 'v1'

/** Accepts any key text and derives 32 bytes from it, so the operator isn't forced to count bytes. */
function toKey(keyText: string): Buffer {
  return createHash('sha256').update(keyText, 'utf8').digest()
}

/** Stored as "v1.<iv>.<tag>.<ciphertext>", all base64url, so the format can change later. */
export function sealSecret(plainText: string, keyText: string): string {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, toKey(keyText), iv)
  const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [VERSION, iv.toString('base64url'), tag.toString('base64url'), ciphertext.toString('base64url')].join('.')
}

/** Null when the value is malformed, from another key, or was tampered with. */
export function openSecret(sealed: string, keyText: string): string | null {
  const [version, iv, tag, ciphertext] = sealed.split('.')
  if (version !== VERSION || !iv || !tag || !ciphertext) return null
  try {
    const decipher = createDecipheriv(ALGORITHM, toKey(keyText), Buffer.from(iv, 'base64url'))
    decipher.setAuthTag(Buffer.from(tag, 'base64url'))
    return Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64url')), decipher.final()]).toString('utf8')
  } catch {
    return null
  }
}
