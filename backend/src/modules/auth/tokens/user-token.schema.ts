import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import { TOKEN_PURPOSES, type TokenPurpose } from '../constants/auth.constants'

export type UserTokenDocument = HydratedDocument<UserToken>

/**
 * A one-time link sent by email: an invitation to set the first password, or a password reset.
 * Only the hash of the link value is stored, so the database alone can never open anyone's account.
 */
@Schema({ collection: 'user_tokens', timestamps: true, versionKey: false })
export class UserToken extends BaseSchema {
  @ApiProperty({ description: 'The account this link belongs to', format: 'uuid' })
  @Prop({ type: String, required: true, index: true })
  userId: string

  @ApiProperty({ description: 'What the link is for', enum: TOKEN_PURPOSES, example: 'invitation' })
  @Prop({ type: String, required: true, enum: TOKEN_PURPOSES })
  purpose: TokenPurpose

  @ApiProperty({ description: 'SHA-256 of the value in the emailed link (internal, never returned)' })
  @Prop({ type: String, required: true })
  tokenHash: string

  @ApiProperty({ description: 'After this time the link stops working' })
  @Prop({ type: Date, required: true })
  expiresAt: Date

  @ApiProperty({ description: 'When the link was used; null while it can still be used', nullable: true, type: Date })
  @Prop({ type: Date, default: null })
  usedAt: Date | null

  @ApiProperty({ description: 'Who sent it; null when the person asked for it themselves', nullable: true, type: String })
  @Prop({ type: String, default: null })
  createdBy: string | null
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken)

UserTokenSchema.index({ tokenHash: 1 }, { unique: true, name: 'uniq_user_token_hash' })
UserTokenSchema.index({ userId: 1, purpose: 1, usedAt: 1 }, { name: 'user_token_by_purpose' })
// Used or not, an expired link is cleaned up by MongoDB a day later (the delay keeps
// "this link has expired" answerable instead of looking like a wrong link).
UserTokenSchema.index({ expiresAt: 1 }, { name: 'user_token_ttl', expireAfterSeconds: 86400 })
