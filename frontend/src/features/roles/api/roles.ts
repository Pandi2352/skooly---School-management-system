import { z } from 'zod'
import { api } from '@/lib/api/client'
import { roleListSchema, roleSchema } from '../schemas/role.schema'
import type { NewRoleInput, Role } from '../types/role.types'
import {
  createSampleRole,
  deleteSampleRole,
  readSampleRoles,
  updateSampleRoleDetails,
  updateSampleRolePermissions,
} from './sample/sampleRoles'

/**
 * Loads roles from the NestJS backend API with sample data for unit tests.
 */
export async function getRoles(): Promise<Role[]> {
  if (import.meta.env.MODE === 'test') {
    return roleListSchema.parse(readSampleRoles())
  }
  return api.get('/roles', roleListSchema)
}

export async function createRole(input: NewRoleInput): Promise<Role> {
  if (import.meta.env.MODE === 'test') {
    return roleSchema.parse(createSampleRole(input, new Date()))
  }
  return api.post('/roles', roleSchema, input)
}

export async function updateRoleDetails({
  id,
  details,
}: {
  id: string
  details: { name: string; description: string }
}): Promise<Role> {
  if (import.meta.env.MODE === 'test') {
    return roleSchema.parse(updateSampleRoleDetails(id, details))
  }
  return api.patch(`/roles/${id}`, roleSchema, details)
}

export async function saveRolePermissions({
  id,
  permissions,
}: {
  id: string
  permissions: string[]
}): Promise<Role> {
  if (import.meta.env.MODE === 'test') {
    return roleSchema.parse(updateSampleRolePermissions(id, permissions))
  }
  return api.put(`/roles/${id}/permissions`, roleSchema, { permissions })
}

export async function deleteRole(id: string): Promise<void> {
  if (import.meta.env.MODE === 'test') {
    deleteSampleRole(id)
    return
  }
  await api.delete(`/roles/${id}`, z.any())
}
