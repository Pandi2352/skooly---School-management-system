import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { generateUuid } from '../../common/utils/uuid.util'
import { DEFAULT_SYSTEM_ROLES } from './constants/default-roles.constant'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdatePermissionsDto } from './dto/update-permissions.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role, RoleDocument } from './schemas/role.schema'

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaultRolesIfEmpty()
  }

  /**
   * Seed default system roles on first boot if no roles exist in MongoDB.
   */
  async seedDefaultRolesIfEmpty(): Promise<void> {
    const count = await this.roleModel.countDocuments().exec()
    if (count === 0) {
      await this.roleModel.insertMany(DEFAULT_SYSTEM_ROLES)
    }
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel
      .find()
      .sort({ kind: 1, name: 1 })
      .exec()
  }

  async findOne(id: string): Promise<RoleDocument> {
    const role = await this.roleModel.findById(id).exec()
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" was not found.`)
    }
    return role
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    const existing = await this.roleModel
      .findOne({ name: { $regex: new RegExp(`^${createRoleDto.name.trim()}$`, 'i') } })
      .exec()

    if (existing) {
      throw new ConflictException(`A role named "${createRoleDto.name}" already exists.`)
    }

    let initialPermissions: string[] = []
    if (createRoleDto.copyFromRoleId) {
      const source = await this.roleModel.findById(createRoleDto.copyFromRoleId).exec()
      if (source) {
        initialPermissions = [...source.permissions]
      }
    }

    const createdRole = new this.roleModel({
      _id: generateUuid(),
      name: createRoleDto.name.trim(),
      description: createRoleDto.description?.trim() ?? '',
      kind: 'custom',
      fullAccess: false,
      permissions: initialPermissions,
    })

    return createdRole.save()
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleDocument> {
    const role = await this.findOne(id)

    if (updateRoleDto.name && updateRoleDto.name.trim() !== role.name) {
      const existing = await this.roleModel
        .findOne({
          _id: { $ne: id },
          name: { $regex: new RegExp(`^${updateRoleDto.name.trim()}$`, 'i') },
        })
        .exec()

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

    return role.save()
  }

  async updatePermissions(id: string, updatePermissionsDto: UpdatePermissionsDto): Promise<RoleDocument> {
    const role = await this.findOne(id)

    if (role.fullAccess) {
      throw new BadRequestException('Administrator permissions are locked and cannot be edited.')
    }

    role.permissions = Array.from(new Set(updatePermissionsDto.permissions))
    return role.save()
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const role = await this.findOne(id)

    if (role.kind === 'system') {
      throw new BadRequestException('System roles cannot be deleted.')
    }

    await this.roleModel.findByIdAndDelete(id).exec()
    return { success: true, message: `Role "${role.name}" has been deleted.` }
  }
}
