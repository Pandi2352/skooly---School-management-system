import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import { USER_LIMITS, USER_STATUSES, type UserStatus } from '../constants/user.constants'

export type UserDocument = HydratedDocument<User>

/**
 * A person who can sign in. One role per account; the role carries the permissions.
 * `_id` is a UUID v4 from BaseSchema (never an ObjectId).
 */
@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class User extends BaseSchema {
  @ApiProperty({ description: 'Full name as it should be shown', example: 'Asha Menon', maxLength: USER_LIMITS.nameMax })
  @Prop({ required: true, trim: true, maxlength: USER_LIMITS.nameMax })
  fullName: string

  @ApiProperty({ description: 'Email used to sign in, kept as typed', example: 'asha.menon@school.in' })
  @Prop({ required: true, trim: true, maxlength: USER_LIMITS.emailMax })
  email: string

  @ApiProperty({ description: 'Lower-cased email for matching and uniqueness (internal, not returned)', example: 'asha.menon@school.in' })
  @Prop({ required: true })
  emailKey: string

  @ApiProperty({ description: 'Contact number', example: '+91 98765 43210', maxLength: USER_LIMITS.phoneMax })
  @Prop({ default: '', trim: true, maxlength: USER_LIMITS.phoneMax })
  phone: string

  @ApiProperty({ description: 'Job title shown next to the name', example: 'Vice Principal', maxLength: USER_LIMITS.designationMax })
  @Prop({ default: '', trim: true, maxlength: USER_LIMITS.designationMax })
  designation: string

  @ApiProperty({ description: 'The role whose permissions this account has', format: 'uuid' })
  @Prop({ type: String, required: true })
  roleId: string

  @ApiProperty({ description: 'Account state', enum: USER_STATUSES, example: 'active' })
  @Prop({ type: String, required: true, enum: USER_STATUSES, default: 'invited' })
  status: UserStatus

  @ApiProperty({ description: 'Argon2id hash of the password; empty until the invitation is accepted (internal, never returned)' })
  @Prop({ type: String, default: '' })
  passwordHash: string

  @ApiProperty({ description: 'When the password was last set', nullable: true, type: Date })
  @Prop({ type: Date, default: null })
  passwordUpdatedAt: Date | null

  @ApiProperty({ description: 'The person must choose a new password before using the app', example: false })
  @Prop({ type: Boolean, default: false })
  mustChangePassword: boolean

  @ApiProperty({ description: 'Last successful sign-in', nullable: true, type: Date })
  @Prop({ type: Date, default: null })
  lastLoginAt: Date | null

  @ApiProperty({ description: 'Wrong passwords since the last success', example: 0 })
  @Prop({ type: Number, default: 0 })
  failedLoginCount: number

  @ApiProperty({ description: 'Sign-in is refused until this time after too many wrong passwords', nullable: true, type: Date })
  @Prop({ type: Date, default: null })
  lockedUntil: Date | null

  @ApiProperty({ description: 'Sign-in also asks for a code from this person’s authenticator app', example: false })
  @Prop({ type: Boolean, default: false })
  twoFactorEnabled: boolean

  @ApiProperty({
    description: 'The authenticator seed, encrypted with TWO_FACTOR_KEY (internal, never returned)',
    nullable: true,
    type: String,
  })
  @Prop({ type: String, default: null })
  twoFactorSecret: string | null

  @ApiProperty({ description: 'When two-step sign-in was switched on', nullable: true, type: Date })
  @Prop({ type: Date, default: null })
  twoFactorConfirmedAt: Date | null

  @ApiProperty({
    description: 'SHA-256 of each unused recovery code (internal, never returned)',
    type: [String],
  })
  @Prop({ type: [String], default: [] })
  twoFactorRecoveryHashes: string[]

  @ApiProperty({ description: 'When the invitation email was last sent', nullable: true, type: Date })
  @Prop({ type: Date, default: null })
  invitedAt: Date | null

  @ApiProperty({ description: 'When the person set their first password', nullable: true, type: Date })
  @Prop({ type: Date, default: null })
  activatedAt: Date | null

  @ApiProperty({ description: 'Who created the account; null for the first administrator', nullable: true, type: String })
  @Prop({ type: String, default: null })
  createdBy: string | null

  @ApiProperty({ description: 'Who last changed the account', nullable: true, type: String })
  @Prop({ type: String, default: null })
  updatedBy: string | null
}

export const UserSchema = SchemaFactory.createForClass(User)

// A unique index (not a pre-check alone) is what stops two requests creating the same email at once.
UserSchema.index({ emailKey: 1 }, { unique: true, name: 'uniq_user_email_key' })
UserSchema.index({ roleId: 1 }, { name: 'user_by_role' })
UserSchema.index({ status: 1, fullName: 1 }, { name: 'user_list_order' })
