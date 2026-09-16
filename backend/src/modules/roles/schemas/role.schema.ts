import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'

export type RoleDocument = HydratedDocument<Role>

export type RoleKind = 'system' | 'custom'

@Schema({ collection: 'roles' })
export class Role extends BaseSchema {
  @ApiProperty({ description: 'Display name of the institutional role', example: 'Teacher' })
  @Prop({ required: true, unique: true, trim: true, index: true })
  name: string

  @ApiProperty({
    description: 'Human-readable description of responsibilities and scope',
    example: 'Teaches classes: exams, homework, timetables and lesson plans.',
  })
  @Prop({ default: '', trim: true })
  description: string

  @ApiProperty({
    description: 'Role classification: system-defined (immutable lifecycle) or custom (school staff configured)',
    enum: ['system', 'custom'],
    example: 'system',
  })
  @Prop({ required: true, enum: ['system', 'custom'], default: 'custom', index: true })
  kind: RoleKind

  @ApiProperty({
    description: 'Whether this role bypasses granular checks and holds complete authority',
    example: false,
  })
  @Prop({ default: false })
  fullAccess: boolean

  @ApiProperty({
    description: 'List of granular permission keys granted to this role (e.g. "academic-management:view")',
    example: ['academic-management:view', 'student-information:view'],
    type: [String],
  })
  @Prop({ type: [String], default: [] })
  permissions: string[]
}

export const RoleSchema = SchemaFactory.createForClass(Role)
