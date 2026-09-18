import { describe, expect, it } from 'vitest'
import type { User } from '../types/user.types'
import {
  canArchive,
  canChangeRole,
  canResendInvitation,
  canSendPasswordReset,
  canSuspend,
  describeLastSignIn,
  findWeakPasswordReason,
  isLastActiveAdministrator,
} from './userRules'

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  fullName: 'Sample Person',
  email: 'sample.person@example.test',
  phone: '',
  designation: '',
  role: { id: 'role-teacher', name: 'Teacher', fullAccess: false },
  status: 'active',
  mustChangePassword: false,
  isLocked: false,
  lockedUntil: null,
  lastLoginAt: null,
  invitedAt: null,
  activatedAt: null,
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
  ...overrides,
})

const context = { currentUserId: 'someone-else', administratorCount: 2 }

describe('the only administrator', () => {
  const soleAdministrator = makeUser({ role: { id: 'role-admin', name: 'Administrator', fullAccess: true } })
  const alone = { currentUserId: 'someone-else', administratorCount: 1 }

  it('is recognised only while active and holding a full-access role', () => {
    expect(isLastActiveAdministrator(soleAdministrator, alone)).toBe(true)
    expect(isLastActiveAdministrator(makeUser(), alone)).toBe(false)
    expect(isLastActiveAdministrator({ ...soleAdministrator, status: 'suspended' }, alone)).toBe(false)
  })

  it('cannot be suspended, archived or moved to another role', () => {
    expect(canSuspend(soleAdministrator, alone).allowed).toBe(false)
    expect(canArchive(soleAdministrator, alone).allowed).toBe(false)
    expect(canChangeRole(soleAdministrator, alone).allowed).toBe(false)
  })

  it('can be suspended once a second administrator exists', () => {
    expect(canSuspend(soleAdministrator, { ...alone, administratorCount: 2 }).allowed).toBe(true)
  })
})

describe('acting on your own account', () => {
  const me = makeUser({ id: 'me' })
  const asMe = { currentUserId: 'me', administratorCount: 3 }

  it('refuses suspending, archiving and role changes, with a reason', () => {
    const suspend = canSuspend(me, asMe)
    expect(suspend).toEqual({ allowed: false, reason: 'You can’t suspend your own account.' })
    expect(canArchive(me, asMe).allowed).toBe(false)
    expect(canChangeRole(me, asMe).allowed).toBe(false)
  })
})

describe('archived accounts', () => {
  const archived = makeUser({ status: 'archived' })

  it('are left alone by every action', () => {
    expect(canSuspend(archived, context).allowed).toBe(false)
    expect(canChangeRole(archived, context).allowed).toBe(false)
    expect(canResendInvitation(archived).allowed).toBe(false)
    expect(canSendPasswordReset(archived).allowed).toBe(false)
  })
})

describe('invitations and resets', () => {
  it('offers a resend only while the invitation is outstanding', () => {
    expect(canResendInvitation(makeUser({ status: 'invited' })).allowed).toBe(true)
    expect(canResendInvitation(makeUser({ status: 'active' })).allowed).toBe(false)
  })

  it('offers a password reset only once a password exists', () => {
    expect(canSendPasswordReset(makeUser({ status: 'active' })).allowed).toBe(true)
    expect(canSendPasswordReset(makeUser({ status: 'invited' })).allowed).toBe(false)
  })
})

describe('describeLastSignIn', () => {
  const now = new Date('2026-09-18T12:00:00.000Z')

  it('says so plainly when the person has never signed in', () => {
    expect(describeLastSignIn(null, now)).toBe('Never signed in')
  })

  it('counts in minutes, hours and days, then falls back to a date', () => {
    expect(describeLastSignIn('2026-09-18T11:45:00.000Z', now)).toBe('15 minutes ago')
    expect(describeLastSignIn('2026-09-18T09:00:00.000Z', now)).toBe('3 hours ago')
    expect(describeLastSignIn('2026-09-16T12:00:00.000Z', now)).toBe('2 days ago')
    expect(describeLastSignIn('2026-01-02T12:00:00.000Z', now)).toBe(
      new Date('2026-01-02T12:00:00.000Z').toLocaleDateString(),
    )
  })

  it('uses the singular for one unit', () => {
    expect(describeLastSignIn('2026-09-18T11:59:00.000Z', now)).toBe('1 minute ago')
  })
})

describe('findWeakPasswordReason', () => {
  it('accepts a long, unrelated passphrase', () => {
    expect(findWeakPasswordReason('quiet harbour lantern', { email: 'asha@school.in' })).toBeNull()
  })

  it('rejects short, obvious or personal passwords', () => {
    expect(findWeakPasswordReason('short1')).toBe('Use at least 10 characters')
    expect(findWeakPasswordReason('password123')).toBe('That password is too easy to guess')
    expect(findWeakPasswordReason('aaaaaaaaaaaa')).toBe('Use more than one repeated character')
    expect(findWeakPasswordReason('ashamenon2026', { fullName: 'Asha Menon' })).toBe(
      'Don’t use your name or email inside the password',
    )
  })
})
