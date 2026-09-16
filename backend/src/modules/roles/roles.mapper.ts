import type { DeletedRoleResponseDto, RoleListMetaDto, RoleResponseDto } from './dto/role-response.dto'
import type { RoleRecord } from './roles.repository'

/** The public shape of a role: `id` instead of `_id`, ISO dates, no internal `nameKey`. */
export function toRoleResponse(role: RoleRecord): RoleResponseDto {
  return {
    id: role._id,
    code: role.code ?? null,
    name: role.name,
    description: role.description,
    kind: role.kind,
    fullAccess: role.fullAccess,
    permissions: [...role.permissions],
    createdAt: new Date(role.createdAt).toISOString(),
    updatedAt: new Date(role.updatedAt).toISOString(),
  }
}

export function toDeletedRoleResponse(role: RoleRecord): DeletedRoleResponseDto {
  return { id: role._id, name: role.name }
}

export function summarizeRoles(roles: Pick<RoleResponseDto, 'kind'>[]): RoleListMetaDto {
  const system = roles.filter((role) => role.kind === 'system').length
  return { total: roles.length, system, custom: roles.length - system }
}
