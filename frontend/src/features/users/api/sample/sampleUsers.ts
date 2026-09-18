import type { UserListQuery } from '../users'
import type { User, UserListResult } from '../../types/user.types'

/**
 * Stand-in accounts for unit tests only, never shown to a school: the names are labelled as sample
 * data and the app reads the real API in every other mode.
 */
const SAMPLE_USERS: User[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    fullName: 'Sample Administrator',
    email: 'sample.administrator@example.test',
    phone: '',
    designation: 'Sample data',
    role: { id: 'role-administrator', name: 'Administrator', fullAccess: true },
    status: 'active',
    mustChangePassword: false,
    isLocked: false,
    lockedUntil: null,
    lastLoginAt: '2026-09-17T09:12:00.000Z',
    invitedAt: null,
    activatedAt: '2026-09-01T09:00:00.000Z',
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-17T09:12:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    fullName: 'Sample Accountant',
    email: 'sample.accountant@example.test',
    phone: '',
    designation: 'Sample data',
    role: { id: 'role-accountant', name: 'Accountant', fullAccess: false },
    status: 'invited',
    mustChangePassword: false,
    isLocked: false,
    lockedUntil: null,
    lastLoginAt: null,
    invitedAt: '2026-09-16T10:00:00.000Z',
    activatedAt: null,
    createdAt: '2026-09-16T10:00:00.000Z',
    updatedAt: '2026-09-16T10:00:00.000Z',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    fullName: 'Sample Teacher',
    email: 'sample.teacher@example.test',
    phone: '',
    designation: 'Sample data',
    role: { id: 'role-teacher', name: 'Teacher', fullAccess: false },
    status: 'suspended',
    mustChangePassword: false,
    isLocked: false,
    lockedUntil: null,
    lastLoginAt: '2026-08-30T06:40:00.000Z',
    invitedAt: null,
    activatedAt: '2026-08-01T06:40:00.000Z',
    createdAt: '2026-08-01T06:40:00.000Z',
    updatedAt: '2026-09-10T06:40:00.000Z',
  },
]

export function readSampleUsers(query: UserListQuery): UserListResult {
  const search = query.search.toLowerCase()
  const matches = SAMPLE_USERS.filter((user) => {
    const matchesSearch =
      search === '' ||
      user.fullName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    const matchesStatus = query.status === 'all' || user.status === query.status
    const matchesRole = query.roleId === 'all' || user.role?.id === query.roleId
    return matchesSearch && matchesStatus && matchesRole
  })

  return {
    users: matches,
    meta: {
      total: matches.length,
      page: query.page,
      limit: query.limit,
      totalPages: Math.max(1, Math.ceil(matches.length / query.limit)),
      active: SAMPLE_USERS.filter((user) => user.status === 'active').length,
      invited: SAMPLE_USERS.filter((user) => user.status === 'invited').length,
      suspended: SAMPLE_USERS.filter((user) => user.status === 'suspended').length,
      archived: 0,
      administrators: 1,
    },
  }
}
