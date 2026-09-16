import { z } from 'zod'
import { ROLE_KINDS } from '../constants'

export const roleSchema = z.object({
  id: z.string(),
  code: z.string().nullable().optional(),
  name: z.string(),
  description: z.string(),
  kind: z.enum(ROLE_KINDS),
  /** Every permission, always, including pages added later. Only Administrator has this. */
  fullAccess: z.boolean(),
  /** Granted permission keys, such as "fees-and-finance.fee-collection:edit". */
  permissions: z.array(z.string()),
  createdAt: z.string().optional(),
})

export const roleListSchema = z.array(roleSchema)

/** Add role / Edit details dialog. */
export const roleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter a role name, like Transport Manager')
    .max(40, 'Use 40 characters or fewer'),
  description: z.string().trim().max(160, 'Use 160 characters or fewer'),
  /** A role id to start from, or "none" for no permissions. */
  copyFromRoleId: z.string(),
})
