import { PASSWORD_MIN_LENGTH } from '../constants'
import type { User } from '../types/user.types'

/**
 * The rules behind every action on an account, as plain functions: no components, no requests.
 * The backend enforces the same rules; these exist so a button can be disabled with a reason
 * instead of failing after the click.
 */

export type ActionCheck = { allowed: true } | { allowed: false; reason: string }

const ALLOWED: ActionCheck = { allowed: true }
const deny = (reason: string): ActionCheck => ({ allowed: false, reason })

export type AccountContext = {
  /** The signed-in person, so nobody suspends or demotes themselves by accident. */
  currentUserId: string
  /** Active accounts with a full-access role, from the list's meta. */
  administratorCount: number
}

const isSelf = (user: User, context: AccountContext) => user.id === context.currentUserId

/** True when switching this account off would leave the school with nobody who can manage it. */
export function isLastActiveAdministrator(user: User, context: AccountContext): boolean {
  return user.status === 'active' && (user.role?.fullAccess ?? false) && context.administratorCount <= 1
}

export function canSuspend(user: User, context: AccountContext): ActionCheck {
  if (user.status === 'archived') return deny('This account is archived.')
  if (user.status === 'suspended') return deny('This account is already suspended.')
  if (isSelf(user, context)) return deny('You can’t suspend your own account.')
  if (isLastActiveAdministrator(user, context)) {
    return deny('This is the only active administrator. Give another account an administrator role first.')
  }
  return ALLOWED
}

export function canReactivate(user: User): ActionCheck {
  if (user.status === 'active') return deny('This account is already active.')
  if (user.status === 'invited') return deny('This account is waiting for its invitation to be accepted.')
  return ALLOWED
}

export function canArchive(user: User, context: AccountContext): ActionCheck {
  if (user.status === 'archived') return deny('This account is already archived.')
  if (isSelf(user, context)) return deny('You can’t archive your own account.')
  if (isLastActiveAdministrator(user, context)) {
    return deny('This is the only active administrator. Give another account an administrator role first.')
  }
  return ALLOWED
}

export function canChangeRole(user: User, context: AccountContext): ActionCheck {
  if (user.status === 'archived') return deny('This account is archived.')
  if (isSelf(user, context)) return deny('You can’t change your own role. Ask another administrator.')
  if (isLastActiveAdministrator(user, context)) {
    return deny('This is the only active administrator, so its role can’t change yet.')
  }
  return ALLOWED
}

export function canResendInvitation(user: User): ActionCheck {
  if (user.status === 'archived') return deny('This account is archived.')
  if (user.status !== 'invited') return deny('This person has already set a password. Send a password reset instead.')
  return ALLOWED
}

export function canSendPasswordReset(user: User): ActionCheck {
  if (user.status === 'archived') return deny('This account is archived.')
  if (user.status === 'invited') return deny('This person hasn’t accepted their invitation yet. Send that again instead.')
  return ALLOWED
}

export function canSetTemporaryPassword(user: User): ActionCheck {
  if (user.status === 'archived') return deny('This account is archived.')
  return ALLOWED
}

export function canDisableTwoFactor(user: User): ActionCheck {
  if (user.status === 'archived') return deny('This account is archived.')
  if (!user.twoFactorEnabled) return deny('This person doesn’t use two-step sign-in.')
  return ALLOWED
}

export function canEditDetails(user: User): ActionCheck {
  if (user.status === 'archived') return deny('This account is archived.')
  return ALLOWED
}

const RELATIVE_UNITS: [limitInMinutes: number, minutesPerUnit: number, name: string][] = [
  [60, 1, 'minute'],
  [60 * 24, 60, 'hour'],
  [60 * 24 * 30, 60 * 24, 'day'],
]

/** "Never signed in", "12 minutes ago", or a date once it stops being useful as "x days ago". */
export function describeLastSignIn(lastLoginAt: string | null, now: Date = new Date()): string {
  if (!lastLoginAt) return 'Never signed in'
  const minutesAgo = Math.max(0, Math.round((now.getTime() - new Date(lastLoginAt).getTime()) / 60_000))
  if (minutesAgo < 1) return 'Just now'
  for (const [limit, perUnit, name] of RELATIVE_UNITS) {
    if (minutesAgo < limit) {
      const value = Math.floor(minutesAgo / perUnit)
      return `${value} ${name}${value === 1 ? '' : 's'} ago`
    }
  }
  return new Date(lastLoginAt).toLocaleDateString()
}

const COMMON_PASSWORDS = ['password', 'passw0rd', '12345678', 'qwerty', 'admin', 'welcome', 'letmein', 'skooly', 'school']

/**
 * The same checks the backend makes, so the person is told before they submit. Length and
 * obviousness, not a recipe of symbols: a long passphrase is both stronger and easier to remember.
 */
export function findWeakPasswordReason(
  password: string,
  context: { email?: string; fullName?: string } = {},
): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) return `Use at least ${PASSWORD_MIN_LENGTH} characters`
  if (password.length > 128) return 'Use 128 characters or fewer'
  if (/^\s|\s$/.test(password)) return 'Remove the space at the start or end'
  const lower = password.toLowerCase()
  if (COMMON_PASSWORDS.some((common) => lower === common || lower.startsWith(`${common}@`) || lower.startsWith(`${common}1`))) {
    return 'That password is too easy to guess'
  }
  if (/^(.)\1+$/.test(password)) return 'Use more than one repeated character'
  const ownWords = [context.email?.split('@')[0], ...(context.fullName?.split(/\s+/) ?? [])]
  const tooPersonal = ownWords
    .map((word) => word?.toLowerCase().trim() ?? '')
    .filter((word) => word.length >= 4)
    .some((word) => lower.includes(word))
  if (tooPersonal) return 'Don’t use your name or email inside the password'
  return null
}
