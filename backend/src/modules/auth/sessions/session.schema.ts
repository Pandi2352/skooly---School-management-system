import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'

export type SessionDocument = HydratedDocument<Session>

/**
 * One signed-in browser. The cookie value itself is never stored, only its SHA-256 hash, so this
 * collection can't be used to sign in as anyone.
 */
@Schema({ collection: 'sessions', timestamps: true, versionKey: false })
export class Session extends BaseSchema {
  @ApiProperty({ description: 'The signed-in user id', format: 'uuid' })
  @Prop({ type: String, required: true, index: true })
  userId: string

  @ApiProperty({ description: 'SHA-256 of the session cookie value (internal, never returned)' })
  @Prop({ type: String, required: true })
  tokenHash: string

  @ApiProperty({ description: 'Browser and device as reported at sign-in', example: 'Chrome on Windows' })
  @Prop({ type: String, default: '' })
  userAgent: string

  @ApiProperty({ description: 'IP address the session was created from', example: '203.0.113.7' })
  @Prop({ type: String, default: '' })
  ip: string

  @ApiProperty({ description: 'Started with "keep me signed in"', example: false })
  @Prop({ type: Boolean, default: false })
  rememberMe: boolean

  @ApiProperty({ description: 'Last request made with this session' })
  @Prop({ type: Date, required: true })
  lastSeenAt: Date

  @ApiProperty({ description: 'Signed out after this time without a request; moves forward as the session is used' })
  @Prop({ type: Date, required: true })
  idleExpiresAt: Date

  @ApiProperty({ description: 'The session ends here however active it is' })
  @Prop({ type: Date, required: true })
  absoluteExpiresAt: Date

  @ApiProperty({ description: 'When the session ended; null while it is live', nullable: true, type: Date })
  @Prop({ type: Date, default: null })
  revokedAt: Date | null

  @ApiProperty({ description: 'Why the session ended, e.g. "Signed out", "Password changed"', example: '' })
  @Prop({ type: String, default: '' })
  revokedReason: string
}

export const SessionSchema = SchemaFactory.createForClass(Session)

SessionSchema.index({ tokenHash: 1 }, { unique: true, name: 'uniq_session_token_hash' })
SessionSchema.index({ userId: 1, revokedAt: 1 }, { name: 'session_by_user' })
// MongoDB removes ended sessions on its own, so the collection does not grow for ever.
SessionSchema.index({ absoluteExpiresAt: 1 }, { name: 'session_ttl', expireAfterSeconds: 0 })
