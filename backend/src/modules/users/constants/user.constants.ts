/**
 * An account moves: invited (link sent, no password yet) to active, and can be suspended (kept, can
 * be switched back on) or archived (kept for history, never signs in again). Nothing is deleted, so
 * "who admitted this student" keeps answering truthfully.
 */
export const USER_STATUSES = ['invited', 'active', 'suspended', 'archived'] as const
export type UserStatus = (typeof USER_STATUSES)[number]

/**
 * Statuses the status endpoint can set. "invited" is reached by creating an account, and "archived"
 * has its own endpoint because it is the one change that ends an account for good.
 */
export const ASSIGNABLE_USER_STATUSES = ['active', 'suspended'] as const
export type AssignableUserStatus = (typeof ASSIGNABLE_USER_STATUSES)[number]

export const USER_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 160,
  phoneMax: 20,
  designationMax: 60,
  searchMax: 80,
  reasonMax: 160,
} as const

/** Letters, spaces and the marks that appear in names: . ' - and / for initials. */
export const USER_NAME_PATTERN = /^[\p{L}][\p{L}\p{M} .'\-/]*$/u

/** Digits with an optional country code, plus spaces or dashes for readability. */
export const USER_PHONE_PATTERN = /^\+?[\d][\d\s-]{5,}$/

/**
 * Permission keys for the User Accounts page. They match the key the Roles & Permissions page shows
 * for Administration to User Accounts (frontend/src/config/navigation.ts), so granting that page in
 * the UI grants these endpoints.
 */
export const USER_PERMISSIONS = {
  view: 'core-setup-and-administration.user-accounts:view',
  create: 'core-setup-and-administration.user-accounts:create',
  edit: 'core-setup-and-administration.user-accounts:edit',
  delete: 'core-setup-and-administration.user-accounts:delete',
} as const

/** Codes for account failures; general ones live in common/constants/error-codes.constant.ts. */
export enum UserErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_TAKEN = 'USER_EMAIL_TAKEN',
  EMAIL_ARCHIVED = 'USER_EMAIL_BELONGS_TO_ARCHIVED_ACCOUNT',
  ROLE_NOT_FOUND = 'USER_ROLE_NOT_FOUND',
  LAST_ADMINISTRATOR = 'LAST_ADMINISTRATOR',
  CANNOT_MODIFY_SELF = 'CANNOT_MODIFY_SELF',
  CANNOT_GRANT_FULL_ACCESS = 'CANNOT_GRANT_FULL_ACCESS',
  STATUS_UNCHANGED = 'USER_STATUS_UNCHANGED',
  ROLE_UNCHANGED = 'USER_ROLE_UNCHANGED',
  NO_CHANGES = 'USER_NO_CHANGES',
  ALREADY_ACTIVATED = 'USER_ALREADY_ACTIVATED',
  ARCHIVED_ACCOUNT = 'USER_ARCHIVED_ACCOUNT',
  TWO_FACTOR_NOT_ON = 'USER_TWO_FACTOR_NOT_ON',
}
