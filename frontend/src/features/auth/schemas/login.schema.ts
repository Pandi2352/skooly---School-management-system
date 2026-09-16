import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Please enter your username or institutional email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  rememberMe: z.boolean().default(false),
})

export type LoginInput = z.infer<typeof loginSchema>
