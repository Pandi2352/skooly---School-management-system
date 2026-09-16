import type { z } from 'zod'
import type { PERMISSION_ACTIONS } from '../constants'
import type { roleFormSchema, roleSchema } from '../schemas/role.schema'

export type Role = z.infer<typeof roleSchema>
export type RoleFormValues = z.infer<typeof roleFormSchema>
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]

/** One page (or single-page module) that permissions apply to. */
export type PermissionFeature = { id: string; label: string }

export type PermissionModule = { slug: string; label: string; features: PermissionFeature[] }

/** How much of a group of permissions is granted, for tri-state checkboxes. */
export type SelectionState = 'all' | 'some' | 'none'

export type NewRoleInput = { name: string; description: string; copyFromRoleId: string | null }
