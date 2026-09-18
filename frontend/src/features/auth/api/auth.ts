import { api } from '@/lib/api/client'
import type { UserSession } from '@/features/users/types/user.types'
import {
  messageSchema,
  ownSessionListSchema,
  passwordChangedSchema,
  setupStateSchema,
  signedInUserSchema,
  tokenCheckSchema,
} from '../schemas/auth.schema'
import type { PasswordChanged, SetupState, SignedInUser, TokenCheck } from '../types/auth.types'
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

export function login(input: LoginInput): Promise<SignedInUser> {
  return api.post('/auth/login', signedInUserSchema, input)
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
