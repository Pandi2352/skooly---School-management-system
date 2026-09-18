import { hash, verify } from '@node-rs/argon2'
import { randomInt } from 'node:crypto'

/**
 * Password hashing and the rules for choosing one. Argon2id is used with its own random salt per
 * password, so the stored hash never reveals the password and two people with the same password
 * get different hashes.
 */

export const PASSWORD_LIMITS = {
  min: 10,
  /** Long enough for a passphrase; a cap keeps hashing time predictable. */
  max: 128,
} as const

/** Deliberately slow: guessing a stolen hash stays expensive while a real sign-in stays quick. */
const ARGON2_OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const

export function hashPassword(plainPassword: string): Promise<string> {
  return hash(plainPassword, ARGON2_OPTIONS)
}

/** False for a wrong password and for a hash this app can't read, never an exception. */
export async function verifyPassword(storedHash: string, plainPassword: string): Promise<boolean> {
  try {
    return await verify(storedHash, plainPassword, ARGON2_OPTIONS)
  } catch {
    return false
  }
}

const COMMON_PASSWORDS = [
  'password', 'password1', 'passw0rd', '12345678', '123456789', '1234567890', 'qwerty', 'qwertyuiop',
  'iloveyou', 'admin', 'administrator', 'welcome', 'letmein', 'abc123', 'school', 'teacher', 'student',
  'principal', 'changeme', 'newpassword', 'skooly',
]

export type PasswordContext = {
  email?: string
  fullName?: string
  schoolName?: string
}

/**
 * Why a password isn't accepted, or null when it's fine. Length and obviousness are checked, not
 * symbol recipes: a long passphrase beats "P@ss1!" and is easier to remember.
 */
export function findWeakPasswordReason(password: string, context: PasswordContext = {}): string | null {
  if (password.length < PASSWORD_LIMITS.min) {
    return `Use at least ${PASSWORD_LIMITS.min} characters.`
  }
  if (password.length > PASSWORD_LIMITS.max) {
    return `Use ${PASSWORD_LIMITS.max} characters or fewer.`
  }
  if (/^\s|\s$/.test(password)) {
    return 'Remove the space at the start or end.'
  }
  const lower = password.toLowerCase()
  if (COMMON_PASSWORDS.some((common) => lower === common || lower.startsWith(`${common}@`) || lower.startsWith(`${common}1`))) {
    return 'That password is too easy to guess. Choose something unrelated to the app or the school.'
  }
  if (/^(.)\1+$/.test(password)) {
    return 'Use more than one repeated character.'
  }
  if (/^(?:0123456789|1234567890|abcdefghij)/.test(lower)) {
    return 'Avoid a straight run of letters or numbers.'
  }
  const ownWords = [
    context.email?.split('@')[0],
    ...(context.fullName?.split(/\s+/) ?? []),
    ...(context.schoolName?.split(/\s+/) ?? []),
  ]
  const tooPersonal = ownWords
    .map((word) => word?.toLowerCase().trim() ?? '')
    .filter((word) => word.length >= 4)
    .some((word) => lower.includes(word))
  if (tooPersonal) {
    return 'Don’t use your name, email or the school’s name inside the password.'
  }
  return null
}

// No look-alike characters (0/O, 1/l/I), so a password read aloud or copied by hand still works.
const TEMP_PASSWORD_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'

/** A temporary password an administrator can read out; the person changes it at first sign-in. */
export function generateTemporaryPassword(length = 14): string {
  let password = ''
  for (let index = 0; index < length; index += 1) {
    password += TEMP_PASSWORD_ALPHABET[randomInt(TEMP_PASSWORD_ALPHABET.length)]
  }
  return password
}
