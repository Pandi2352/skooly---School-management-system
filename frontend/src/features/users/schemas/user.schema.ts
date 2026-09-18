import { z } from 'zod'
import { PASSWORD_MIN_LENGTH, USER_STATUSES } from '../constants'

/** The API sits outside this app's type system, so every response is parsed, never trusted. */

export const userRoleSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  fullAccess: z.boolean(),
})

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  designation: z.string(),
  role: userRoleSummarySchema.nullable(),
  status: z.enum(USER_STATUSES),
  mustChangePassword: z.boolean(),
  isLocked: z.boolean(),
  lockedUntil: z.string().nullable(),
  lastLoginAt: z.string().nullable(),
  invitedAt: z.string().nullable(),
  activatedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const userListSchema = z.array(userSchema)

export const userListMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  active: z.number(),
  invited: z.number(),
  suspended: z.number(),
  archived: z.number(),
  administrators: z.number(),
})

export const createdUserSchema = z.object({
  user: userSchema,
  invitationEmailSent: z.boolean(),
  /** Sent back only when the email couldn't go out, so it can be shared another way. */
  invitationLink: z.string().optional(),
  temporaryPassword: z.string().optional(),
})

export const invitationSentSchema = z.object({
  user: userSchema,
  emailSent: z.boolean(),
  link: z.string().optional(),
  expiresAt: z.string(),
})

export const temporaryPasswordSchema = z.object({
  user: userSchema,
  temporaryPassword: z.string(),
  sessionsEnded: z.number(),
})

export const userSessionSchema = z.object({
  id: z.string(),
  device: z.string(),
  ip: z.string(),
  lastSeenAt: z.string(),
  signedInAt: z.string(),
  expiresAt: z.string(),
  isCurrent: z.boolean(),
})

export const userSessionListSchema = z.array(userSessionSchema)

export const sessionsEndedSchema = z.object({ sessionsEnded: z.number() })

/** One line of the account's history: who did what to it, and when. */
export const auditEventSchema = z.object({
  id: z.string(),
  action: z.string(),
  label: z.string(),
  actorName: z.string(),
  targetName: z.string(),
  summary: z.string(),
  ip: z.string(),
  at: z.string(),
})

export const auditEventListSchema = z.array(auditEventSchema)

// Forms ----------------------------------------------------------------------

const email = z
  .string()
  .trim()
  .min(1, 'Enter an email address')
  .email('Enter a valid email address, like asha.menon@school.in')

const fullName = z
  .string()
  .trim()
  .min(2, 'Enter the person’s full name')
  .max(80, 'Use 80 characters or fewer')

const phone = z
  .string()
  .trim()
  .max(20, 'Use 20 characters or fewer')
  .refine((value) => value === '' || /^\+?[\d][\d\s-]{5,}$/.test(value), 'Enter at least 6 digits')

const designation = z.string().trim().max(60, 'Use 60 characters or fewer')

export const passwordFieldSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(128, 'Use 128 characters or fewer')

/**
 * One schema for adding and for editing, because the form is one form: `mode` says which, and the
 * questions that only apply when adding — the role, and how the person first gets in — are checked
 * only then. Editing touches contact details alone; role and status have their own actions.
 */
export const userFormSchema = z
  .object({
    mode: z.enum(['create', 'edit']),
    fullName,
    email,
    phone,
    designation,
    roleId: z.string(),
    handover: z.enum(['invitation', 'temporary-password']),
    temporaryPassword: z.string(),
  })
  .superRefine((values, context) => {
    if (values.mode !== 'create') return
    if (values.roleId === '') {
      context.addIssue({ code: 'custom', path: ['roleId'], message: 'Choose a role' })
    }
    if (values.handover !== 'temporary-password') return
    const result = passwordFieldSchema.safeParse(values.temporaryPassword)
    if (!result.success) {
      context.addIssue({
        code: 'custom',
        path: ['temporaryPassword'],
        message: result.error.issues[0]?.message ?? 'Enter a password',
      })
    }
  })

export const setTemporaryPasswordFormSchema = z.object({ password: passwordFieldSchema })
