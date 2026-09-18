// No look-alike characters (0/O, 1/l/I), so a password read out loud or copied by hand still works.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'

/**
 * A temporary password an administrator can read out. It uses the browser's cryptographic random
 * source, not Math.random, because this value guards a real account until the person changes it.
 */
export function generateReadablePassword(length = 14): string {
  const values = new Uint32Array(length)
  crypto.getRandomValues(values)
  return Array.from(values, (value) => ALPHABET[value % ALPHABET.length]).join('')
}
