import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { FilterQuery, Model } from 'mongoose'
import { escapeRegex } from '../../common/utils/mongo-error.util'
import { generateUuid } from '../../common/utils/uuid.util'
import type { SystemRoleSeed } from './constants/default-roles.constant'
import type { RoleKind } from './constants/role.constants'
import { Role, RoleDocument } from './schemas/role.schema'
import { roleNameKey } from './utils/role.util'

/** A role as stored, read with lean() for speed (plain object, no Mongoose document methods). */
export type RoleRecord = {
  _id: string
  code: string | null
  name: string
  nameKey: string
  description: string
  kind: RoleKind
  fullAccess: boolean
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

export type NewRoleData = Pick<RoleRecord, 'code' | 'name' | 'nameKey' | 'description' | 'kind' | 'fullAccess' | 'permissions'>
export type RoleChanges = Partial<Pick<RoleRecord, 'name' | 'nameKey' | 'description' | 'permissions'>>
export type RoleListFilter = { kind?: RoleKind; search?: string }

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** All database access for roles. No business rules here; those live in RolesService. */
@Injectable()
export class RolesRepository {
  constructor(@InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>) {}

  findAll(filter: RoleListFilter = {}): Promise<RoleRecord[]> {
    const query: FilterQuery<RoleDocument> = {}
    if (filter.kind) query.kind = filter.kind
    if (filter.search) {
      const pattern = new RegExp(escapeRegex(filter.search), 'i')
      query.$or = [{ name: pattern }, { description: pattern }]
    }
    // Administrator first, then system roles, then custom roles, each A–Z.
    return this.roleModel.find(query).sort({ fullAccess: -1, kind: -1, name: 1 }).lean<RoleRecord[]>().exec()
  }

  findById(id: string): Promise<RoleRecord | null> {
    return this.roleModel.findById(id).lean<RoleRecord>().exec()
  }

  async isNameKeyTaken(nameKey: string, exceptId?: string): Promise<boolean> {
    const filter: FilterQuery<RoleDocument> = { nameKey }
    if (exceptId) filter._id = { $ne: exceptId }
    return (await this.roleModel.exists(filter)) !== null
  }

  async create(data: NewRoleData): Promise<RoleRecord> {
    const created = await this.roleModel.create({ _id: generateUuid(), ...data })
    return created.toObject<RoleRecord>()
  }

  updateById(id: string, changes: RoleChanges): Promise<RoleRecord | null> {
    return this.roleModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true, runValidators: true })
      .lean<RoleRecord>()
      .exec()
  }

  deleteById(id: string): Promise<RoleRecord | null> {
    return this.roleModel.findByIdAndDelete(id).lean<RoleRecord>().exec()
  }

  /**
   * Inserts system roles that don't exist yet, matched by `code`, in one round trip.
   * $setOnInsert never touches roles that already exist, so a school's edits survive restarts.
   * Returns how many were inserted.
   */
  async insertMissingSystemRoles(seeds: SystemRoleSeed[]): Promise<number> {
    if (seeds.length === 0) return 0
    const result = await this.roleModel.bulkWrite(
      seeds.map((seed) => ({
        updateOne: {
          filter: { code: seed.code },
          update: {
            $setOnInsert: {
              _id: generateUuid(),
              code: seed.code,
              name: seed.name,
              nameKey: roleNameKey(seed.name),
              description: seed.description,
              kind: 'system',
              fullAccess: seed.fullAccess,
              permissions: seed.permissions,
            },
          },
          upsert: true,
        },
      })),
      { ordered: false },
    )
    return result.upsertedCount
  }

  /** Roles saved by older versions: a non-UUID `_id` (e.g. "teacher") or no `nameKey`. */
  findLegacyRoles(): Promise<(Partial<RoleRecord> & { _id: string })[]> {
    return this.roleModel
      .find({ $or: [{ _id: { $not: UUID_V4 } }, { nameKey: { $exists: false } }] })
      .lean<(Partial<RoleRecord> & { _id: string })[]>()
      .exec()
  }

  /**
   * Replaces a legacy role with an upgraded copy. `_id` can't be changed in place, so the old
   * record is removed first (freeing its name) and restored if the insert fails.
   */
  async replaceRole(legacy: Partial<RoleRecord> & { _id: string }, upgraded: NewRoleData & { _id: string }): Promise<void> {
    await this.roleModel.deleteOne({ _id: legacy._id }).exec()
    try {
      await this.roleModel.create(upgraded)
    } catch (error) {
      // Put the original back exactly as it was. `lean` skips schema validation, which the legacy
      // record would fail (no nameKey), and keeps its string `_id` (the raw driver types expect ObjectId).
      await this.roleModel.insertMany([legacy], { lean: true })
      throw error
    }
  }

  /** Brings indexes in line with the schema, dropping ones older versions created (e.g. unique `name`). */
  async syncIndexes(): Promise<void> {
    await this.roleModel.syncIndexes()
  }
}
