import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { FilterQuery, Model } from 'mongoose'
import { generateUuid } from '../../common/utils/uuid.util'
import type { AuditAction } from './audit.constants'
import { AuditEvent, AuditEventDocument } from './schemas/audit-event.schema'

export type AuditEventRecord = {
  _id: string
  action: AuditAction
  actorId: string | null
  actorName: string
  targetUserId: string | null
  targetName: string
  summary: string
  ip: string
  userAgent: string
  createdAt: Date
  updatedAt: Date
}

export type NewAuditEvent = Omit<AuditEventRecord, '_id' | 'createdAt' | 'updatedAt'>

export type AuditListFilter = { targetUserId?: string; action?: AuditAction }

/** All database access for the audit trail. Events are written and read, never changed. */
@Injectable()
export class AuditRepository {
  constructor(@InjectModel(AuditEvent.name) private readonly auditModel: Model<AuditEventDocument>) {}

  async create(event: NewAuditEvent): Promise<void> {
    await this.auditModel.create({ _id: generateUuid(), ...event })
  }

  async findPage(
    filter: AuditListFilter,
    options: { skip: number; limit: number },
  ): Promise<{ events: AuditEventRecord[]; total: number }> {
    const query: FilterQuery<AuditEventDocument> = {}
    if (filter.targetUserId) query.targetUserId = filter.targetUserId
    if (filter.action) query.action = filter.action

    const [events, total] = await Promise.all([
      this.auditModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(options.skip)
        .limit(options.limit)
        .lean<AuditEventRecord[]>()
        .exec(),
      this.auditModel.countDocuments(query).exec(),
    ])
    return { events, total }
  }
}
