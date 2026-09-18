/**
 * An account moves: invited (link sent, no password yet) → active. It can be suspended (kept and
 * blocked, can be switched back on) or archived (kept so old records still say who made them).
 * These match the backend's own list.
 */
export const USER_STATUSES = ['invited', 'active', 'suspended', 'archived'] as const
export type UserStatus = (typeof USER_STATUSES)[number]

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  invited: 'Invited',
  active: 'Active',
  suspended: 'Suspended',
  archived: 'Archived',
}

/** What each state means, shown where the word alone isn't enough. */
export const USER_STATUS_HINTS: Record<UserStatus, string> = {
  invited: 'Invitation sent. They haven’t chosen a password yet.',
  active: 'Can sign in.',
  suspended: 'Blocked from signing in. Can be switched back on.',
  archived: 'No longer in use. Their past records are kept.',
}

export const USER_SORT_FIELDS = ['fullName', 'createdAt', 'lastLoginAt'] as const
export type UserSortField = (typeof USER_SORT_FIELDS)[number]

export const DEFAULT_USERS_PAGE_SIZE = 20

/** Permission keys for this page, built the same way the Roles & Permissions page builds them. */
export const USER_PERMISSIONS = {
  view: 'core-setup-and-administration.user-accounts:view',
  create: 'core-setup-and-administration.user-accounts:create',
  edit: 'core-setup-and-administration.user-accounts:edit',
  delete: 'core-setup-and-administration.user-accounts:delete',
} as const

/** Matches the backend rule: length and obviousness, not a recipe of symbols. */
export const PASSWORD_MIN_LENGTH = 10
