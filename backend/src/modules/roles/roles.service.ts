import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { isDuplicateKeyError } from '../../common/utils/mongo-error.util'
import { generateUuid, isValidUuid } from '../../common/utils/uuid.util'
import { SYSTEM_ROLE_SEEDS } from './constants/default-roles.constant'
import { CreateRoleDto } from './dto/create-role.dto'
import { ListRolesQueryDto } from './dto/list-roles-query.dto'
import { DeletedRoleResponseDto, RoleListMetaDto, RoleResponseDto } from './dto/role-response.dto'
import { UpdatePermissionsDto } from './dto/update-permissions.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import {
  copySourceNotFound,
  fullAccessLocked,
  fullAccessNotCopyable,
  noRoleChanges,
  roleNameTaken,
  roleNotFound,
  systemRoleDelete,
  systemRoleRename,
} from './roles.errors'
import { summarizeRoles, toDeletedRoleResponse, toRoleResponse } from './roles.mapper'
import { RoleChanges, RoleRecord, RolesRepository } from './roles.repository'
import { cleanRoleName, normalizePermissions, roleNameKey } from './utils/role.util'

export type RoleListResult = { roles: RoleResponseDto[]; meta: RoleListMetaDto }

/** Role rules: unique names, locked system roles, locked full access, and system role setup. */
@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name)

  constructor(private readonly rolesRepository: RolesRepository) {}

  /** Upgrades roles from older versions, aligns indexes and adds any missing system roles. */
  async onModuleInit(): Promise<void> {
    try {
      const migrated = await this.migrateLegacyRoles()
      if (migrated > 0) this.logger.log(`Upgraded ${migrated} role(s) to UUID ids`)
      await this.rolesRepository.syncIndexes()
      await this.ensureSystemRoles()
    } catch (error) {
      // Don't stop the whole API from starting; the error is logged for follow-up.
      this.logger.error('Could not prepare roles', error instanceof Error ? error.stack : String(error))
    }
  }

  async ensureSystemRoles(): Promise<number> {
    const inserted = await this.rolesRepository.insertMissingSystemRoles(SYSTEM_ROLE_SEEDS)
    if (inserted > 0) this.logger.log(`Added ${inserted} missing system role(s)`)
    return inserted
  }

  /** Gives roles saved with non-UUID ids (e.g. "teacher") a UUID, a nameKey and their system code. */
  async migrateLegacyRoles(): Promise<number> {
    const legacyRoles = await this.rolesRepository.findLegacyRoles()
    const systemCodes = new Set(SYSTEM_ROLE_SEEDS.map((seed) => seed.code))

    for (const legacy of legacyRoles) {
      const name = cleanRoleName(legacy.name ?? '')
      const code = legacy.code ?? (systemCodes.has(legacy._id) ? legacy._id : null)
      await this.rolesRepository.replaceRole(legacy, {
        _id: isValidUuid(legacy._id) ? legacy._id : generateUuid(),
        code,
        name,
        nameKey: roleNameKey(name),
        description: legacy.description ?? '',
        kind: code === null ? (legacy.kind ?? 'custom') : 'system',
        fullAccess: legacy.fullAccess ?? false,
        permissions: normalizePermissions(legacy.permissions ?? []),
      })
    }
    return legacyRoles.length
  }

  async findAll(query: ListRolesQueryDto): Promise<RoleListResult> {
    const records = await this.rolesRepository.findAll({ kind: query.kind, search: query.search || undefined })
    const roles = records.map(toRoleResponse)
    return { roles, meta: summarizeRoles(roles) }
  }

  async findOne(id: string): Promise<RoleResponseDto> {
    return toRoleResponse(await this.getRoleOrThrow(id))
  }

  async create(dto: CreateRoleDto): Promise<RoleResponseDto> {
    const name = cleanRoleName(dto.name)
    const nameKey = roleNameKey(name)
    if (await this.rolesRepository.isNameKeyTaken(nameKey)) throw roleNameTaken(name)

    const permissions = dto.copyFromRoleId ? await this.permissionsToCopy(dto.copyFromRoleId) : []

    try {
      const created = await this.rolesRepository.create({
        code: null,
        name,
        nameKey,
        description: dto.description ?? '',
        kind: 'custom',
        fullAccess: false,
        permissions,
      })
      return toRoleResponse(created)
    } catch (error) {
      // Another request took the name between the check and the insert.
      if (isDuplicateKeyError(error)) throw roleNameTaken(name)
      throw error
    }
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleResponseDto> {
    if (dto.name === undefined && dto.description === undefined) throw noRoleChanges()
    const role = await this.getRoleOrThrow(id)
    const changes: RoleChanges = {}

    if (dto.name !== undefined) {
      const name = cleanRoleName(dto.name)
      if (name !== role.name) {
        if (role.kind === 'system') throw systemRoleRename(role.name)
        const nameKey = roleNameKey(name)
        // Only a real name change needs the uniqueness check; "teacher" → "Teacher" is the same key.
        if (nameKey !== role.nameKey && (await this.rolesRepository.isNameKeyTaken(nameKey, id))) {
          throw roleNameTaken(name)
        }
        changes.name = name
        changes.nameKey = nameKey
      }
    }
    if (dto.description !== undefined && dto.description !== role.description) {
      changes.description = dto.description
    }

    if (Object.keys(changes).length === 0) return toRoleResponse(role)

    try {
      const updated = await this.rolesRepository.updateById(id, changes)
      if (!updated) throw roleNotFound(id)
      return toRoleResponse(updated)
    } catch (error) {
      if (isDuplicateKeyError(error)) throw roleNameTaken(changes.name ?? role.name)
      throw error
    }
  }

  async updatePermissions(id: string, dto: UpdatePermissionsDto): Promise<RoleResponseDto> {
    const role = await this.getRoleOrThrow(id)
    if (role.fullAccess) throw fullAccessLocked(role.name)

    const updated = await this.rolesRepository.updateById(id, {
      permissions: normalizePermissions(dto.permissions),
    })
    if (!updated) throw roleNotFound(id)
    return toRoleResponse(updated)
  }

  async remove(id: string): Promise<DeletedRoleResponseDto> {
    const role = await this.getRoleOrThrow(id)
    if (role.kind === 'system') throw systemRoleDelete(role.name)

    const deleted = await this.rolesRepository.deleteById(id)
    if (!deleted) throw roleNotFound(id)
    return toDeletedRoleResponse(deleted)
  }

  private async getRoleOrThrow(id: string): Promise<RoleRecord> {
    const role = await this.rolesRepository.findById(id)
    if (!role) throw roleNotFound(id)
    return role
  }

  private async permissionsToCopy(sourceId: string): Promise<string[]> {
    const source = await this.rolesRepository.findById(sourceId)
    if (!source) throw copySourceNotFound(sourceId)
    if (source.fullAccess) throw fullAccessNotCopyable(source.name)
    return normalizePermissions(source.permissions)
  }
}
