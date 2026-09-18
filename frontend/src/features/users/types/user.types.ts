import type { z } from 'zod'
import type {
  auditEventSchema,
  createdUserSchema,
  invitationSentSchema,
  temporaryPasswordSchema,
  userCreateFormSchema,
  userEditFormSchema,
  userListMetaSchema,
  userRoleSummarySchema,
  userSchema,
  userSessionSchema,
} from '../schemas/user.schema'

// Domain types come from the schemas, so a change to the API shape is a type error, not a surprise.
export type User = z.infer<typeof userSchema>
export type UserRoleSummary = z.infer<typeof userRoleSummarySchema>
export type UserListMeta = z.infer<typeof userListMetaSchema>
export type CreatedUser = z.infer<typeof createdUserSchema>
export type InvitationSent = z.infer<typeof invitationSentSchema>
export type TemporaryPasswordResult = z.infer<typeof temporaryPasswordSchema>
export type UserSession = z.infer<typeof userSessionSchema>
export type AccountEvent = z.infer<typeof auditEventSchema>

export type UserCreateFormValues = z.infer<typeof userCreateFormSchema>
export type UserEditFormValues = z.infer<typeof userEditFormSchema>

export type UserListResult = { users: User[]; meta: UserListMeta }
