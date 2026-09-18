import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import { AUDIT_ACTIONS, AUDIT_RETENTION_DAYS, type AuditAction } from '../audit.constants'

export type AuditEventDocument = HydratedDocument<AuditEvent>

/**
 * One thing that happened to an account. Written once and never changed: an audit trail that can be
 * edited answers nothing. Names and emails are copied in, so the record still reads correctly after
 * the account itself is renamed or archived.
 */
@Schema({ collection: 'audit_events', timestamps: true, versionKey: false })
export class AuditEvent extends BaseSchema {
  @ApiProperty({ description: 'What happened', enum: AUDIT_ACTIONS, example: 'user.role_changed' })
  @Prop({ type: String, required: true, enum: AUDIT_ACTIONS })
  action: AuditAction

  @ApiProperty({ description: 'Who did it; null when nobody was signed in, as at sign-in', nullable: true, type: String })
  @Prop({ type: String, default: null })
  actorId: string | null

  @ApiProperty({ description: 'The actor as they were named at the time', example: 'Asha Menon' })
  @Prop({ type: String, default: '' })
  actorName: string

  @ApiProperty({ description: 'The account it happened to', nullable: true, type: String, format: 'uuid' })
  @Prop({ type: String, default: null, index: true })
  targetUserId: string | null

  @ApiProperty({ description: 'The affected account as it was named at the time', example: 'Ravi Kumar' })
  @Prop({ type: String, default: '' })
  targetName: string

  @ApiProperty({ description: 'A short human summary, e.g. "Teacher to Accountant"', example: 'Teacher to Accountant' })
  @Prop({ type: String, default: '' })
  summary: string

  @ApiProperty({ description: 'Where the request came from', example: '203.0.113.7' })
  @Prop({ type: String, default: '' })
  ip: string

  @ApiProperty({ description: 'Browser and device as reported', example: 'Chrome on Windows' })
  @Prop({ type: String, default: '' })
  userAgent: string
}

export const AuditEventSchema = SchemaFactory.createForClass(AuditEvent)

AuditEventSchema.index({ createdAt: -1 }, { name: 'audit_recent_first' })
AuditEventSchema.index({ targetUserId: 1, createdAt: -1 }, { name: 'audit_by_target' })
AuditEventSchema.index({ action: 1, createdAt: -1 }, { name: 'audit_by_action' })
// Events are removed by MongoDB once they are older than the retention period.
AuditEventSchema.index(
  { createdAt: 1 },
  { name: 'audit_ttl', expireAfterSeconds: AUDIT_RETENTION_DAYS * 24 * 60 * 60 },
)
