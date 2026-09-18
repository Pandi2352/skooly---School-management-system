import { api } from '@/lib/api/client'
import {
  auditEventListSchema,
  createdUserSchema,
  invitationSentSchema,
  sessionsEndedSchema,
  temporaryPasswordSchema,
  userListMetaSchema,
  userListSchema,
  userSchema,
  userSessionListSchema,
} from '../schemas/user.schema'
import type {
  AccountEvent,
  CreatedUser,
  InvitationSent,
  TemporaryPasswordResult,
  User,
  UserListResult,
  UserSession,
} from '../types/user.types'
import type { UserStatus } from '../constants'
import { readSampleUsers } from './sample/sampleUsers'

export type UserListQuery = {
  search: string
  status: UserStatus | 'all'
  /** A role id, or "all" for every role. */
  roleId: string
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

function toSearchParams(query: UserListQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  })
  if (query.search) params.set('search', query.search)
  if (query.status !== 'all') params.set('status', query.status)
  if (query.roleId !== 'all') params.set('roleId', query.roleId)
  return params.toString()
}

/** Reads accounts from the backend; unit tests run against labelled sample data instead. */
export async function getUsers(query: UserListQuery): Promise<UserListResult> {
  if (import.meta.env.MODE === 'test') return readSampleUsers(query)
  const { data, meta } = await api.getWithMeta(
    `/users?${toSearchParams(query)}`,
    userListSchema,
    userListMetaSchema,
  )
  return { users: data, meta }
}

export function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`, userSchema)
}

export type CreateUserInput = {
  fullName: string
  email: string
  phone?: string
  designation?: string
  roleId: string
  sendInvitation: boolean
  temporaryPassword?: string
}

export function createUser(input: CreateUserInput): Promise<CreatedUser> {
  return api.post('/users', createdUserSchema, input)
}

export type UpdateUserInput = {
  id: string
  changes: { fullName?: string; email?: string; phone?: string; designation?: string }
}

export function updateUser({ id, changes }: UpdateUserInput): Promise<User> {
  return api.patch(`/users/${id}`, userSchema, changes)
}

export function changeUserRole({ id, roleId }: { id: string; roleId: string }): Promise<User> {
  return api.put(`/users/${id}/role`, userSchema, { roleId })
}

export function changeUserStatus({
  id,
  status,
  reason,
}: {
  id: string
  status: 'active' | 'suspended'
  reason?: string
}): Promise<User> {
  return api.put(`/users/${id}/status`, userSchema, { status, ...(reason ? { reason } : {}) })
}

export function archiveUser(id: string): Promise<User> {
  return api.delete(`/users/${id}`, userSchema)
}

export function resendInvitation(id: string): Promise<InvitationSent> {
  return api.post(`/users/${id}/invitation`, invitationSentSchema)
}

export function sendPasswordReset(id: string): Promise<InvitationSent> {
  return api.post(`/users/${id}/password-reset`, invitationSentSchema)
}

export function setTemporaryPassword({
  id,
  password,
}: {
  id: string
  password?: string
}): Promise<TemporaryPasswordResult> {
  return api.post(`/users/${id}/temporary-password`, temporaryPasswordSchema, password ? { password } : {})
}

/** For a colleague locked out of their authenticator app. It can never be switched on for someone. */
export function disableUserTwoFactor(id: string): Promise<User> {
  return api.delete(`/users/${id}/two-factor`, userSchema)
}

export function getUserSessions(id: string): Promise<UserSession[]> {
  return api.get(`/users/${id}/sessions`, userSessionListSchema)
}

/** What has happened to this account: sign-ins, lockouts and administrator changes, newest first. */
export function getUserAudit(id: string): Promise<AccountEvent[]> {
  if (import.meta.env.MODE === 'test') return Promise.resolve([])
  return api.get(`/users/${id}/audit`, auditEventListSchema)
}

export async function revokeUserSessions(id: string): Promise<number> {
  const { sessionsEnded } = await api.delete(`/users/${id}/sessions`, sessionsEndedSchema)
  return sessionsEnded
}
