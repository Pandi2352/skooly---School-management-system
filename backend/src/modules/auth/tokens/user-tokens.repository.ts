import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { generateUuid } from '../../../common/utils/uuid.util'
import type { TokenPurpose } from '../constants/auth.constants'
import { UserToken, UserTokenDocument } from './user-token.schema'

export type UserTokenRecord = {
  _id: string
  userId: string
  purpose: TokenPurpose
  tokenHash: string
  expiresAt: Date
  usedAt: Date | null
  createdBy: string | null
  createdAt: Date
  updatedAt: Date
}

export type NewUserTokenData = Pick<UserTokenRecord, 'userId' | 'purpose' | 'tokenHash' | 'expiresAt' | 'createdBy'>

/** All database access for invitation and password-reset links. */
@Injectable()
export class UserTokensRepository {
  constructor(@InjectModel(UserToken.name) private readonly tokenModel: Model<UserTokenDocument>) {}

  async create(data: NewUserTokenData): Promise<UserTokenRecord> {
    const created = await this.tokenModel.create({ _id: generateUuid(), ...data })
    return created.toObject<UserTokenRecord>()
  }

  findByTokenHash(tokenHash: string): Promise<UserTokenRecord | null> {
    return this.tokenModel.findOne({ tokenHash }).lean<UserTokenRecord>().exec()
  }

  /** Marks the link used; false when another request used it first. */
  async markUsed(id: string, usedAt = new Date()): Promise<boolean> {
    const result = await this.tokenModel.updateOne({ _id: id, usedAt: null }, { $set: { usedAt } }).exec()
    return result.modifiedCount > 0
  }

  /**
   * Cancels the user's unused links of one kind. Sending a new invitation or reset makes earlier
   * ones stop working, so an old email can't be used later.
   */
  async invalidateOpenTokens(userId: string, purpose: TokenPurpose): Promise<number> {
    const result = await this.tokenModel
      .updateMany({ userId, purpose, usedAt: null }, { $set: { usedAt: new Date() } })
      .exec()
    return result.modifiedCount
  }

  /** The most recent unused link of this kind, used to show "invited, link sent on ...". */
  findLatestOpen(userId: string, purpose: TokenPurpose): Promise<UserTokenRecord | null> {
    return this.tokenModel
      .findOne({ userId, purpose, usedAt: null, expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .lean<UserTokenRecord>()
      .exec()
  }
}
