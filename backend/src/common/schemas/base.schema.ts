import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { generateUuid } from '../utils/uuid.util'

/**
 * Base abstract class for all MongoDB schemas.
 * Enforces string UUID primary keys instead of default BSON ObjectId.
 */
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = ret._id
      delete ret.__v
      return ret
    },
  },
  toObject: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = ret._id
      delete ret.__v
      return ret
    },
  },
})
export abstract class BaseSchema {
  @ApiProperty({
    description: 'Unique identifier (UUID v4)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @Prop({
    type: String,
    default: () => generateUuid(),
    required: true,
  })
  _id: string

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2026-09-16T12:00:00.000Z',
  })
  createdAt?: Date

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2026-09-16T12:00:00.000Z',
  })
  updatedAt?: Date
}
