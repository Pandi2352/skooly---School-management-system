import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common'
import { generateUuid } from '../../common/utils/uuid.util'
import { DEFAULT_SYSTEM_ROLES } from './constants/default-roles.constant'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdatePermissionsDto } from './dto/update-permissions.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RolesRepository } from './roles.repository'
import { RoleDocument } from './schemas/role.schema'

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaultRolesIfEmpty()
  }

  /**
   * Seed default system roles on first boot if no roles exist in MongoDB.
   */
  async seedDefaultRolesIfEmpty(): Promise<void> {
    const count = await this.rolesRepository.count()
    if (count === 0) {
      await this.rolesRepository.insertMany(DEFAULT_SYSTEM_ROLES)
    }
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.rolesRepository.findAll()
  }

  async findOne(id: string): Promise<RoleDocument> {
    const role = await this.rolesRepository.findById(id)
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" was not found.`)
    }
    return role
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    const existing = await this.rolesRepository.findByName(createRoleDto.name)
    if (existing) {
      throw new ConflictException(`A role named "${createRoleDto.name}" already exists.`)
    }

    let initialPermissions: string[] = []
    if (createRoleDto.copyFromRoleId) {
      const source = await this.rolesRepository.findById(createRoleDto.copyFromRoleId)
      if (source) {
        initialPermissions = [...source.permissions]
      }
    }

    return this.rolesRepository.create({
      _id: generateUuid(),
      name: createRoleDto.name.trim(),
      description: createRoleDto.description?.trim() ?? '',
      kind: 'custom',
      fullAccess: false,
      permissions: initialPermissions,
    })
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleDocument> {
    const role = await this.findOne(id)

    if (updateRoleDto.name && updateRoleDto.name.trim() !== role.name) {
      const existing = await this.rolesRepository.findByNameExcludingId(
        updateRoleDto.name.trim(),
        id,
      )

      if (existing) {
        throw new ConflictException(`A role named "${updateRoleDto.name}" already exists.`)
      }

      if (role.kind === 'system') {
        throw new BadRequestException('System role names cannot be renamed.')
      }

      role.name = updateRoleDto.name.trim()
    }

    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description.trim()
    }

    const updated = await this.rolesRepository.updateById(id, {
      name: role.name,
      description: role.description,
    })

    if (!updated) {
      throw new NotFoundException(`Role with ID "${id}" was not found.`)
    }

    return updated
  }

  async updatePermissions(
    id: string,
    updatePermissionsDto: UpdatePermissionsDto,
  ): Promise<RoleDocument> {
    const role = await this.findOne(id)

    if (role.fullAccess) {
      throw new BadRequestException('Administrator permissions are locked and cannot be edited.')
    }

    const uniquePermissions = Array.from(new Set(updatePermissionsDto.permissions))
    const updated = await this.rolesRepository.updateById(id, {
      permissions: uniquePermissions,
    })

    if (!updated) {
      throw new NotFoundException(`Role with ID "${id}" was not found.`)
    }

    return updated
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const role = await this.findOne(id)

    if (role.kind === 'system') {
      throw new BadRequestException('System roles cannot be deleted.')
    }

    await this.rolesRepository.deleteById(id)
    return { success: true, message: `Role "${role.name}" has been deleted.` }
  }
}
