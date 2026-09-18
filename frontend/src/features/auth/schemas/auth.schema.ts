import { z } from 'zod'
import { passwordFieldSchema, userSchema, userSessionListSchema } from '@/features/users/schemas/user.schema'

/** Responses -------------------------------------------------------------- */

export const signedInUserSchema = z.object({
  user: userSchema,
  /** Empty for a full-access role, where `fullAccess` is true instead. */
  permissions: z.array(z.string()),
  fullAccess: z.boolean(),
  mustChangePassword: z.boolean(),
  sessionExpiresAt: z.string(),
})

export const setupStateSchema = z.object({ needsSetup: z.boolean() })

export const tokenCheckSchema = z.object({
  purpose: z.enum(['invitation', 'password_reset']),
  fullName: z.string(),
  email: z.string(),
  expiresAt: z.string(),
})

export const messageSchema = z.object({ message: z.string() })

export const passwordChangedSchema = z.object({
  otherSessionsEnded: z.number(),
  emailSent: z.boolean().optional(),
})

export const ownSessionListSchema = userSessionListSchema

/** Forms ------------------------------------------------------------------ */

const email = z
  .string()
  .trim()
  .min(1, 'Enter the email address you sign in with')
  .email('Enter a valid email address')

export const loginFormSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
  rememberMe: z.boolean(),
})

export const forgotPasswordFormSchema = z.object({ email })

/** Both places where a password is chosen ask for it twice, so a typo can't lock someone out. */
const passwordsMatch = (values: { password: string; confirmPassword: string }) =>
  values.password === values.confirmPassword

const MATCH_ERROR = { path: ['confirmPassword'], message: 'Both passwords must match' }

export const setupFormSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name').max(80, 'Use 80 characters or fewer'),
    email,
    designation: z.string().trim().max(60, 'Use 60 characters or fewer'),
    password: passwordFieldSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, MATCH_ERROR)

export const newPasswordFormSchema = z
  .object({
    password: passwordFieldSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, MATCH_ERROR)

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: passwordFieldSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Both passwords must match',
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: 'Choose a password you haven’t used here before',
  })
