import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import { ROLE_KINDS, ROLE_LIMITS, type RoleKind } from '../constants/role.constants'

export type RoleDocument = HydratedDocument<Role>

/** A staff role and the permissions it grants. `_id` is a UUID v4 from BaseSchema (never an ObjectId). */
@Schema({ collection: 'roles', timestamps: true, versionKey: false })
export class Role extends BaseSchema {
  @ApiProperty({
    description: 'Stable code for system roles, used by code to find them; null for custom roles',
    example: 'teacher',
    nullable: true,
    type: String,
  })
  @Prop({ type: String, default: null })
  code: string | null

  @ApiProperty({
    description: 'Role name, unique regardless of capitals',
    example: 'Teacher',
    minLength: ROLE_LIMITS.nameMin,
    maxLength: ROLE_LIMITS.nameMax,
  })
  @Prop({ required: true, trim: true, maxlength: ROLE_LIMITS.nameMax })
  name: string

  @ApiProperty({
    description: 'Lower-cased name used for case-insensitive uniqueness (internal, not returned by the API)',
    example: 'teacher',
  })
  @Prop({ required: true })
  nameKey: string

  @ApiProperty({
    description: 'What people with this role do',
    example: 'Teaches classes: exams, homework, timetables and lesson plans.',
    maxLength: ROLE_LIMITS.descriptionMax,
  })
  @Prop({ default: '', trim: true, maxlength: ROLE_LIMITS.descriptionMax })
  description: string

  @ApiProperty({
    description: 'system: comes with the app, can’t be renamed or deleted; custom: added by the school',
    enum: ROLE_KINDS,
    example: 'system',
  })
  @Prop({ required: true, enum: ROLE_KINDS, default: 'custom' })
  kind: RoleKind

  @ApiProperty({
    description: 'Every permission, including pages added later. Only the Administrator system role has it',
    example: false,
  })
  @Prop({ default: false })
  fullAccess: boolean

  @ApiProperty({
    description: 'Granted permission keys: "<module>.<page>:<action>" or "<module>:<action>"',
    example: ['academic-management.online-exams:view', 'student-information.student-list:view'],
    type: [String],
  })
  @Prop({ type: [String], default: [] })
  permissions: string[]
}

export const RoleSchema = SchemaFactory.createForClass(Role)

// A unique index (not a pre-check alone) is what stops two requests creating the same name at once.
RoleSchema.index({ nameKey: 1 }, { unique: true, name: 'uniq_role_name_key' })
RoleSchema.index(
  { code: 1 },
  { unique: true, name: 'uniq_role_code', partialFilterExpression: { code: { $type: 'string' } } },
)
RoleSchema.index({ fullAccess: -1, kind: -1, name: 1 }, { name: 'role_list_order' })
