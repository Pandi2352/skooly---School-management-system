/** Codes for sign-in failures; general ones live in common/constants/error-codes.constant.ts. */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  ACCOUNT_ARCHIVED = 'ACCOUNT_ARCHIVED',
  ACCOUNT_NOT_ACTIVATED = 'ACCOUNT_NOT_ACTIVATED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
  SETUP_ALREADY_DONE = 'SETUP_ALREADY_DONE',
  SETUP_ROLE_MISSING = 'SETUP_ADMINISTRATOR_ROLE_MISSING',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_ALREADY_USED = 'TOKEN_ALREADY_USED',
  CURRENT_PASSWORD_WRONG = 'CURRENT_PASSWORD_WRONG',
  PASSWORD_UNCHANGED = 'PASSWORD_UNCHANGED',
  TWO_FACTOR_REQUIRED = 'TWO_FACTOR_REQUIRED',
  TWO_FACTOR_UNAVAILABLE = 'TWO_FACTOR_UNAVAILABLE',
  TWO_FACTOR_NOT_CONFIGURED = 'TWO_FACTOR_NOT_CONFIGURED',
  TWO_FACTOR_ALREADY_ON = 'TWO_FACTOR_ALREADY_ON',
  TWO_FACTOR_CODE_WRONG = 'TWO_FACTOR_CODE_WRONG',
  TWO_FACTOR_CHALLENGE_EXPIRED = 'TWO_FACTOR_CHALLENGE_EXPIRED',
}

/**
 * What a one-time secret is for: two arrive by email, and "two_factor" is the short-lived handle
 * for a sign-in that has passed the password and is waiting for a code.
 */
export const TOKEN_PURPOSES = ['invitation', 'password_reset', 'two_factor'] as const
export type TokenPurpose = (typeof TOKEN_PURPOSES)[number]

/** Sign-in endpoints are rate limited by IP on top of the per-account lock. */
export const AUTH_RATE_LIMIT = { limit: 10, ttlSeconds: 60 } as const
