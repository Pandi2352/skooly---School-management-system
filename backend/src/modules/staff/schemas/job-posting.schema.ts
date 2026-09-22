import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import {
  DEPARTMENTS,
  JOB_STATUSES,
  type Department,
  type JobStatus,
} from '../constants/staff.constants'

export type JobPostingDocument = HydratedDocument<JobPosting>

@Schema({ timestamps: true })
export class JobPosting extends BaseSchema {
  @ApiProperty({ example: 'Science Teacher – Grade 9 & 10' })
  @Prop({ required: true, trim: true })
  title: string

  @ApiProperty({ example: 'Secondary' })
  @Prop({ required: true, enum: DEPARTMENTS })
  department: Department

  @ApiProperty({ example: 'We are looking for a qualified Science teacher...' })
  @Prop({ required: true })
  description: string

  @ApiProperty({ example: 'M.Sc. Physics, B.Ed., minimum 3 years experience', required: false })
  @Prop({ type: String, default: '' })
  requirements?: string

  @ApiProperty({ example: 'open', enum: JOB_STATUSES })
  @Prop({ required: true, enum: JOB_STATUSES, default: 'open' })
  status: JobStatus

  @ApiProperty({ example: '2026-05-31', required: false })
  @Prop({ type: String, default: null })
  closingDate?: string | null

  @ApiProperty({ example: 2 })
  @Prop({ type: Number, default: 1, min: 1 })
  vacancies: number
}

export const JobPostingSchema = SchemaFactory.createForClass(JobPosting)
