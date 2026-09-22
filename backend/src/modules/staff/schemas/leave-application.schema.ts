import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import {
  LEAVE_STATUSES,
  LEAVE_TYPES,
  type LeaveStatus,
  type LeaveType,
} from '../constants/staff.constants'

export type LeaveApplicationDocument = HydratedDocument<LeaveApplication>

@Schema({ timestamps: true })
export class LeaveApplication extends BaseSchema {
  @ApiProperty({ example: 'uuid-of-staff' })
  @Prop({ type: String, required: true, index: true })
  staffId: string

  @ApiProperty({ example: 'casual', enum: LEAVE_TYPES })
  @Prop({ required: true, enum: LEAVE_TYPES })
  leaveType: LeaveType

  @ApiProperty({ example: '2026-04-05' })
  @Prop({ required: true })
  fromDate: string

  @ApiProperty({ example: '2026-04-07' })
  @Prop({ required: true })
  toDate: string

  @ApiProperty({ example: 3 })
  @Prop({ type: Number, required: true, min: 0.5 })
  days: number

  @ApiProperty({ example: 'Attending family function' })
  @Prop({ required: true, trim: true })
  reason: string

  @ApiProperty({ example: 'pending', enum: LEAVE_STATUSES })
  @Prop({ required: true, enum: LEAVE_STATUSES, default: 'pending' })
  status: LeaveStatus

  @ApiProperty({ example: 'uuid-of-approver', required: false })
  @Prop({ type: String, default: null })
  approvedBy?: string | null

  @ApiProperty({ required: false })
  @Prop({ type: Date, default: null })
  approvedAt?: Date | null

  @ApiProperty({ example: 'Approved. Enjoy.', required: false })
  @Prop({ default: '' })
  remarks?: string
}

export const LeaveApplicationSchema = SchemaFactory.createForClass(LeaveApplication)
LeaveApplicationSchema.index({ staffId: 1, fromDate: -1 })
LeaveApplicationSchema.index({ status: 1, fromDate: -1 })
