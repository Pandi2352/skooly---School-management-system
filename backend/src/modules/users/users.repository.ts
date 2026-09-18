import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { FilterQuery, Model, SortOrder } from 'mongoose'
import { escapeRegex } from '../../common/utils/mongo-error.util'
import { generateUuid } from '../../common/utils/uuid.util'
import type { UserStatus } from './constants/user.constants'
import type { UserSortField } from './dto/list-users-query.dto'
import { User, UserDocument } from './schemas/user.schema'

/** A user as stored, read with lean() (plain object, no Mongoose document methods). */
export type UserRecord = {
  _id: string
  fullName: string
  email: string
  emailKey: string
  phone: string
  designation: string
  roleId: string
  status: UserStatus
  passwordHash: string
  passwordUpdatedAt: Date | null
  mustChangePassword: boolean
  lastLoginAt: Date | null
  failedLoginCount: number
  lockedUntil: Date | null
  twoFactorEnabled: boolean
  twoFactorSecret: string | null
  twoFactorConfirmedAt: Date | null
  twoFactorRecoveryHashes: string[]
  invitedAt: Date | null
  activatedAt: Date | null
  createdBy: string | null
  updatedBy: string | null
  createdAt: Date
  updatedAt: Date
}

export type NewUserData = Pick<
  UserRecord,
  'fullName' | 'email' | 'emailKey' | 'phone' | 'designation' | 'roleId' | 'status' | 'createdBy'
> &
  Partial<Pick<UserRecord, 'passwordHash' | 'passwordUpdatedAt' | 'mustChangePassword' | 'invitedAt' | 'activatedAt'>>

export type UserChanges = Partial<
  Pick<
    UserRecord,
    | 'fullName'
    | 'email'
    | 'emailKey'
    | 'phone'
    | 'designation'
    | 'roleId'
    | 'status'
    | 'passwordHash'
    | 'passwordUpdatedAt'
    | 'mustChangePassword'
    | 'lastLoginAt'
    | 'failedLoginCount'
    | 'lockedUntil'
    | 'twoFactorEnabled'
    | 'twoFactorSecret'
    | 'twoFactorConfirmedAt'
    | 'twoFactorRecoveryHashes'
    | 'invitedAt'
    | 'activatedAt'
    | 'updatedBy'
  >
>

export type UserListFilter = { search?: string; status?: UserStatus; roleId?: string }
export type UserListOptions = { sortBy: UserSortField; sortOrder: 'asc' | 'desc'; skip: number; limit: number }
export type UserStatusCounts = Record<UserStatus, number>

/** All database access for user accounts. No business rules here; those live in UsersService. */
@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  private buildQuery(filter: UserListFilter): FilterQuery<UserDocument> {
    const query: FilterQuery<UserDocument> = {}
    if (filter.status) query.status = filter.status
    if (filter.roleId) query.roleId = filter.roleId
    if (filter.search) {
      const pattern = new RegExp(escapeRegex(filter.search), 'i')
      query.$or = [{ fullName: pattern }, { email: pattern }, { designation: pattern }]
    }
    return query
  }

  async findPage(filter: UserListFilter, options: UserListOptions): Promise<{ users: UserRecord[]; total: number }> {
    const query = this.buildQuery(filter)
    const direction: SortOrder = options.sortOrder === 'asc' ? 1 : -1
    // A second key keeps the order stable when many rows share a value (or have none, like lastLoginAt).
    const sort: Record<string, SortOrder> = { [options.sortBy]: direction, _id: 1 }
    const [users, total] = await Promise.all([
      this.userModel.find(query).sort(sort).skip(options.skip).limit(options.limit).lean<UserRecord[]>().exec(),
      this.userModel.countDocuments(query).exec(),
    ])
    return { users, total }
  }

  /** How many accounts are in each state, ignoring the list filters. */
  async countByStatus(): Promise<UserStatusCounts> {
    const rows = await this.userModel
      .aggregate<{ _id: UserStatus; count: number }>([{ $group: { _id: '$status', count: { $sum: 1 } } }])
      .exec()
    const counts: UserStatusCounts = { invited: 0, active: 0, suspended: 0, archived: 0 }
    for (const row of rows) {
      if (row._id in counts) counts[row._id] = row.count
    }
    return counts
  }

  findById(id: string): Promise<UserRecord | null> {
    return this.userModel.findById(id).lean<UserRecord>().exec()
  }

  findByEmailKey(key: string): Promise<UserRecord | null> {
    return this.userModel.findOne({ emailKey: key }).lean<UserRecord>().exec()
  }

  findManyByIds(ids: string[]): Promise<UserRecord[]> {
    return this.userModel.find({ _id: { $in: ids } }).lean<UserRecord[]>().exec()
  }

  async isEmailKeyTaken(key: string, exceptId?: string): Promise<boolean> {
    const filter: FilterQuery<UserDocument> = { emailKey: key }
    if (exceptId) filter._id = { $ne: exceptId }
    return (await this.userModel.exists(filter)) !== null
  }

  /** Accounts that can still sign in and hold one of these roles. Used for the last-administrator rule. */
  countActiveWithRoles(roleIds: string[], exceptUserId?: string): Promise<number> {
    const filter: FilterQuery<UserDocument> = { roleId: { $in: roleIds }, status: 'active' }
    if (exceptUserId) filter._id = { $ne: exceptUserId }
    return this.userModel.countDocuments(filter).exec()
  }

  countAll(): Promise<number> {
    return this.userModel.estimatedDocumentCount().exec()
  }

  countWithRole(roleId: string): Promise<number> {
    return this.userModel.countDocuments({ roleId }).exec()
  }

  async create(data: NewUserData): Promise<UserRecord> {
    const created = await this.userModel.create({ _id: generateUuid(), ...data })
    return created.toObject<UserRecord>()
  }

  updateById(id: string, changes: UserChanges): Promise<UserRecord | null> {
    return this.userModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true, runValidators: true })
      .lean<UserRecord>()
      .exec()
  }

  /** One wrong password more. Returns the updated account so the caller can see if it is now locked. */
  recordFailedLogin(id: string, lockedUntil: Date | null): Promise<UserRecord | null> {
    const update = lockedUntil
      ? { $inc: { failedLoginCount: 1 }, $set: { lockedUntil } }
      : { $inc: { failedLoginCount: 1 } }
    return this.userModel.findByIdAndUpdate(id, update, { new: true }).lean<UserRecord>().exec()
  }

  async recordSuccessfulLogin(id: string, at: Date): Promise<void> {
    await this.userModel
      .updateOne({ _id: id }, { $set: { lastLoginAt: at, failedLoginCount: 0, lockedUntil: null } })
      .exec()
  }

  /** Brings indexes in line with the schema, dropping ones older versions created. */
  async syncIndexes(): Promise<void> {
    await this.userModel.syncIndexes()
  }
}
