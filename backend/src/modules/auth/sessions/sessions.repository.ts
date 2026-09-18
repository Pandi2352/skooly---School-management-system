import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { generateUuid } from '../../../common/utils/uuid.util'
import { Session, SessionDocument } from './session.schema'

/** A session as stored, read with lean() (plain object, no Mongoose document methods). */
export type SessionRecord = {
  _id: string
  userId: string
  tokenHash: string
  userAgent: string
  ip: string
  rememberMe: boolean
  lastSeenAt: Date
  idleExpiresAt: Date
  absoluteExpiresAt: Date
  revokedAt: Date | null
  revokedReason: string
  createdAt: Date
  updatedAt: Date
}

export type NewSessionData = Omit<SessionRecord, '_id' | 'revokedAt' | 'revokedReason' | 'createdAt' | 'updatedAt'>

/** All database access for sessions. Rules live in AuthService. */
@Injectable()
export class SessionsRepository {
  constructor(@InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>) {}

  async create(data: NewSessionData): Promise<SessionRecord> {
    const created = await this.sessionModel.create({ _id: generateUuid(), ...data })
    return created.toObject<SessionRecord>()
  }

  findLiveByTokenHash(tokenHash: string, now: Date): Promise<SessionRecord | null> {
    return this.sessionModel
      .findOne({ tokenHash, revokedAt: null, idleExpiresAt: { $gt: now }, absoluteExpiresAt: { $gt: now } })
      .lean<SessionRecord>()
      .exec()
  }

  findById(id: string): Promise<SessionRecord | null> {
    return this.sessionModel.findById(id).lean<SessionRecord>().exec()
  }

  /** Live sessions of one user, most recently used first. */
  findLiveByUser(userId: string, now: Date): Promise<SessionRecord[]> {
    return this.sessionModel
      .find({ userId, revokedAt: null, idleExpiresAt: { $gt: now }, absoluteExpiresAt: { $gt: now } })
      .sort({ lastSeenAt: -1 })
      .lean<SessionRecord[]>()
      .exec()
  }

  /** Moves the idle deadline forward as the session is used. */
  async touch(id: string, lastSeenAt: Date, idleExpiresAt: Date): Promise<void> {
    await this.sessionModel.updateOne({ _id: id }, { $set: { lastSeenAt, idleExpiresAt } }).exec()
  }

  async revokeById(id: string, reason: string, now = new Date()): Promise<boolean> {
    const result = await this.sessionModel
      .updateOne({ _id: id, revokedAt: null }, { $set: { revokedAt: now, revokedReason: reason } })
      .exec()
    return result.modifiedCount > 0
  }

  /** Ends every live session of a user, optionally keeping the one they are using right now. */
  async revokeAllForUser(userId: string, reason: string, exceptSessionId?: string): Promise<number> {
    const filter: Record<string, unknown> = { userId, revokedAt: null }
    if (exceptSessionId) filter._id = { $ne: exceptSessionId }
    const result = await this.sessionModel
      .updateMany(filter, { $set: { revokedAt: new Date(), revokedReason: reason } })
      .exec()
    return result.modifiedCount
  }
}
