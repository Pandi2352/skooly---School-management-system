import { roleListSchema, roleSchema } from '../schemas/role.schema'
import type { NewRoleInput, Role } from '../types/role.types'
import {
  createSampleRole,
  deleteSampleRole,
  readSampleRoles,
  updateSampleRoleDetails,
  updateSampleRolePermissions,
} from './sample/sampleRoles'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** TODO(api): `api.get('/roles', roleListSchema)`. */
export async function getRoles(): Promise<Role[]> {
  await Promise.resolve()
  return roleListSchema.parse(readSampleRoles())
}

/** TODO(api): `api.post('/roles', roleSchema, input)`. */
export async function createRole(input: NewRoleInput): Promise<Role> {
  await wait(300)
  return roleSchema.parse(createSampleRole(input, new Date()))
}

/** TODO(api): `api.patch(`/roles/${id}`, roleSchema, details)`. */
export async function updateRoleDetails({
  id,
  details,
}: {
  id: string
  details: { name: string; description: string }
}): Promise<Role> {
  await wait(300)
  return roleSchema.parse(updateSampleRoleDetails(id, details))
}

/** TODO(api): `api.put(`/roles/${id}/permissions`, roleSchema, { permissions })`. */
export async function saveRolePermissions({ id, permissions }: { id: string; permissions: string[] }): Promise<Role> {
  await wait(400)
  return roleSchema.parse(updateSampleRolePermissions(id, permissions))
}

/** TODO(api): `api.delete(`/roles/${id}`)`. */
export async function deleteRole(id: string): Promise<void> {
  await wait(300)
  deleteSampleRole(id)
}
