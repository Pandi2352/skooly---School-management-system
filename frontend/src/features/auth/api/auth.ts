import { api } from '@/lib/api/client'
import type { UserSession } from '@/features/users/types/user.types'
import {
  loginResultSchema,
  messageSchema,
  ownSessionListSchema,
  passwordChangedSchema,
  recoveryCodesSchema,
  setupStateSchema,
  signedInUserSchema,
  tokenCheckSchema,
  twoFactorSetupSchema,
  twoFactorStatusSchema,
} from '../schemas/auth.schema'
import type {
  LoginResult,
  PasswordChanged,
  SetupState,
  SignedInUser,
  TokenCheck,
  TwoFactorSetup,
  TwoFactorStatus,
} from '../types/auth.types'
import { SAMPLE_SESSION } from './sample/sampleSession'

/**
 * The session lives in an httpOnly cookie the browser sends on its own, so nothing here handles a
 * token: every call just needs `credentials: 'include'`, which the API client always sets.
 */

export function getSetupState(): Promise<SetupState> {
  if (import.meta.env.MODE === 'test') return Promise.resolve({ needsSetup: false })
  return api.get('/auth/setup-state', setupStateSchema)
}

export type SetupInput = { fullName: string; email: string; password: string; designation?: string }

export function createFirstAdministrator(input: SetupInput): Promise<SignedInUser> {
  return api.post('/auth/setup', signedInUserSchema, input)
}

export type LoginInput = { email: string; password: string; rememberMe: boolean }

/** Answers with a session, or with a handle to finish signing in once a code is entered. */
export function login(input: LoginInput): Promise<LoginResult> {
  return api.post('/auth/login', loginResultSchema, input)
}

export function loginWithTwoFactor(input: { challengeToken: string; code: string }): Promise<SignedInUser> {
  return api.post('/auth/login/two-factor', signedInUserSchema, input)
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout', messageSchema)
}

/** Who is signed in. Read fresh, so a role change or suspension shows up on the next request. */
export function getCurrentAccount(): Promise<SignedInUser> {
  // Unit tests render pages without signing in; every other mode asks the API.
  if (import.meta.env.MODE === 'test') return Promise.resolve(SAMPLE_SESSION)
  return api.get('/auth/me', signedInUserSchema)
}

export function changeOwnPassword(input: {
  currentPassword: string
  newPassword: string
}): Promise<PasswordChanged> {
  return api.post('/auth/change-password', passwordChangedSchema, input)
}

/** Always answers the same way, so this form can't be used to find out who has an account. */
export async function requestPasswordReset(email: string): Promise<string> {
  const { message } = await api.post('/auth/forgot-password', messageSchema, { email })
  return message
}

/** Checks a link from an email before showing the password form. */
export function checkPasswordToken(token: string): Promise<TokenCheck> {
  return api.post('/auth/check-token', tokenCheckSchema, { token })
}

/** Finishes an invitation or a reset; the person is signed in straight away. */
export function setPasswordWithToken(input: { token: string; password: string }): Promise<SignedInUser> {
  return api.post('/auth/set-password', signedInUserSchema, input)
}

// Two-step sign-in ----------------------------------------------------------

export function getTwoFactorStatus(): Promise<TwoFactorStatus> {
  if (import.meta.env.MODE === 'test') {
    return Promise.resolve({ available: true, enabled: false, confirmedAt: null, recoveryCodesLeft: 0 })
  }
  return api.get('/auth/two-factor', twoFactorStatusSchema)
}

/** Starts enrolment: a QR code to scan, and the same seed as text for typing in by hand. */
export function startTwoFactorSetup(): Promise<TwoFactorSetup> {
  return api.post('/auth/two-factor/setup', twoFactorSetupSchema)
}

/** Confirms the app is set up correctly and switches it on; the recovery codes come back once. */
export async function enableTwoFactor(code: string): Promise<string[]> {
  const { recoveryCodes } = await api.post('/auth/two-factor/enable', recoveryCodesSchema, { code })
  return recoveryCodes
}

export async function disableTwoFactor(password: string): Promise<string> {
  const { message } = await api.post('/auth/two-factor/disable', messageSchema, { password })
  return message
}

export async function regenerateRecoveryCodes(password: string): Promise<string[]> {
  const { recoveryCodes } = await api.post('/auth/two-factor/recovery-codes', recoveryCodesSchema, { password })
  return recoveryCodes
}

export function getOwnSessions(): Promise<UserSession[]> {
  if (import.meta.env.MODE === 'test') return Promise.resolve([])
  return api.get('/auth/sessions', ownSessionListSchema)
}

export async function revokeOwnSession(id: string): Promise<void> {
  await api.delete(`/auth/sessions/${id}`, messageSchema)
}

export async function revokeOtherSessions(): Promise<string> {
  const { message } = await api.delete('/auth/sessions', messageSchema)
  return message
}
