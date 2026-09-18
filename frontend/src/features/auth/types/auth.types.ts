import type { z } from 'zod'
import type {
  changePasswordFormSchema,
  loginFormSchema,
  newPasswordFormSchema,
  passwordChangedSchema,
  setupFormSchema,
  setupStateSchema,
  signedInUserSchema,
  tokenCheckSchema,
} from '../schemas/auth.schema'

// Domain types come from the schemas, so a change to the API shape is a type error, not a surprise.
export type SignedInUser = z.infer<typeof signedInUserSchema>
export type SetupState = z.infer<typeof setupStateSchema>
export type TokenCheck = z.infer<typeof tokenCheckSchema>
export type PasswordChanged = z.infer<typeof passwordChangedSchema>

export type LoginFormValues = z.infer<typeof loginFormSchema>
export type SetupFormValues = z.infer<typeof setupFormSchema>
export type NewPasswordFormValues = z.infer<typeof newPasswordFormSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>
