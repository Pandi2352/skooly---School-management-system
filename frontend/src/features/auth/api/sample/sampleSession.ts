import type { SignedInUser } from '../../types/auth.types'

/**
 * The signed-in person used by unit tests only. It has full access, so a test that renders the
 * sidebar or a page sees the whole menu without every test having to sign in first. The app reads
 * the real /auth/me in every other mode.
 */
export const SAMPLE_SESSION: SignedInUser = {
  user: {
    id: '00000000-0000-4000-8000-000000000001',
    fullName: 'Sample Administrator',
    email: 'sample.administrator@example.test',
    phone: '',
    designation: 'Sample data',
    role: { id: 'role-administrator', name: 'Administrator', fullAccess: true },
    status: 'active',
    mustChangePassword: false,
    isLocked: false,
    twoFactorEnabled: false,
    lockedUntil: null,
    lastLoginAt: '2026-09-18T08:00:00.000Z',
    invitedAt: null,
    activatedAt: '2026-09-01T09:00:00.000Z',
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-18T08:00:00.000Z',
  },
  permissions: [],
  fullAccess: true,
  mustChangePassword: false,
  sessionExpiresAt: '2026-09-18T20:00:00.000Z',
}
