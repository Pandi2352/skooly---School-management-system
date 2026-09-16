import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from './schemas/role.schema'

export interface IRolesRepository {
  findAll(): Promise<RoleDocument[]>
  findById(id: string): Promise<RoleDocument | null>
  findByName(name: string): Promise<RoleDocument | null>
  create(roleData: Partial<Role>): Promise<RoleDocument>
  updateById(id: string, updateData: Partial<Role>): Promise<RoleDocument | null>
  deleteById(id: string): Promise<boolean>
  count(): Promise<number>
  insertMany(roles: Partial<Role>[]): Promise<RoleDocument[]>
}

@Injectable()
export class RolesRepository implements IRolesRepository {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel
      .find()
      .sort({ kind: 1, name: 1 })
      .exec()
  }

  async findById(id: string): Promise<RoleDocument | null> {
    return this.roleModel.findById(id).exec()
  }

  async findByName(name: string): Promise<RoleDocument | null> {
    return this.roleModel
      .findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } })
      .exec()
  }

  async findByNameExcludingId(name: string, excludeId: string): Promise<RoleDocument | null> {
    return this.roleModel
      .findOne({
        _id: { $ne: excludeId },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      })
      .exec()
  }

  async create(roleData: Partial<Role>): Promise<RoleDocument> {
    const createdRole = new this.roleModel(roleData)
    return createdRole.save()
  }

  async updateById(id: string, updateData: Partial<Role>): Promise<RoleDocument | null> {
    return this.roleModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec()
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.roleModel.findByIdAndDelete(id).exec()
    return result !== null
  }

  async count(): Promise<number> {
    return this.roleModel.countDocuments().exec()
  }

  async insertMany(roles: Partial<Role>[]): Promise<RoleDocument[]> {
    return this.roleModel.insertMany(roles) as unknown as Promise<RoleDocument[]>
  }
}
