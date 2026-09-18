import type { SessionRecord } from '../auth/sessions/sessions.repository'
import type { UserStatusCounts } from './users.repository'
import type {
  UserListMetaDto,
  UserResponseDto,
  UserRoleSummaryDto,
  UserSessionResponseDto,
} from './dto/user-response.dto'
import type { UserRecord } from './users.repository'
import { describeUserAgent } from './utils/user.util'

const iso = (value: Date | null | undefined): string | null => (value ? new Date(value).toISOString() : null)

/**
 * The public shape of an account: `id` instead of `_id`, ISO dates, the role inline, and never the
 * password hash or the internal `emailKey`.
 */
export function toUserResponse(user: UserRecord, role: UserRoleSummaryDto | null, now = new Date()): UserResponseDto {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    designation: user.designation,
    role,
    status: user.status,
    mustChangePassword: user.mustChangePassword,
    isLocked: user.lockedUntil !== null && new Date(user.lockedUntil) > now,
    // ?? false: a row written before this field existed must not break the whole response.
    twoFactorEnabled: user.twoFactorEnabled ?? false,
    lockedUntil: iso(user.lockedUntil),
    lastLoginAt: iso(user.lastLoginAt),
    invitedAt: iso(user.invitedAt),
    activatedAt: iso(user.activatedAt),
    createdAt: new Date(user.createdAt).toISOString(),
    updatedAt: new Date(user.updatedAt).toISOString(),
  }
}

export function toUserListMeta(
  counts: UserStatusCounts,
  administrators: number,
  page: { total: number; page: number; limit: number },
): UserListMetaDto {
  return {
    total: page.total,
    page: page.page,
    limit: page.limit,
    totalPages: page.limit > 0 ? Math.ceil(page.total / page.limit) : 0,
    active: counts.active,
    invited: counts.invited,
    suspended: counts.suspended,
    archived: counts.archived,
    administrators,
  }
}

export function toSessionResponse(session: SessionRecord, currentSessionId?: string): UserSessionResponseDto {
  return {
    id: session._id,
    device: describeUserAgent(session.userAgent),
    ip: session.ip,
    lastSeenAt: new Date(session.lastSeenAt).toISOString(),
    signedInAt: new Date(session.createdAt).toISOString(),
    expiresAt: new Date(session.idleExpiresAt).toISOString(),
    isCurrent: session._id === currentSessionId,
  }
}
