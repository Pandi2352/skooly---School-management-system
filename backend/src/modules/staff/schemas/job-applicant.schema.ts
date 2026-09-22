import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import { APPLICANT_STATUSES, type ApplicantStatus } from '../constants/staff.constants'

export type JobApplicantDocument = HydratedDocument<JobApplicant>

@Schema({ timestamps: true })
export class JobApplicant extends BaseSchema {
  @ApiProperty({ example: 'uuid-of-job-posting' })
  @Prop({ type: String, required: true, index: true })
  jobId: string

  @ApiProperty({ example: 'Ramesh Kumar' })
  @Prop({ required: true, trim: true })
  name: string

  @ApiProperty({ example: 'ramesh.kumar@gmail.com' })
  @Prop({ required: true, trim: true })
  email: string

  @ApiProperty({ example: '+91 98765 00001' })
  @Prop({ required: true })
  phone: string

  @ApiProperty({ example: '/uploads/resumes/resume-uuid.pdf', required: false })
  @Prop({ default: '' })
  resumeUrl?: string

  @ApiProperty({ example: 'received', enum: APPLICANT_STATUSES })
  @Prop({ required: true, enum: APPLICANT_STATUSES, default: 'received' })
  status: ApplicantStatus

  @ApiProperty({ example: '2026-05-10T10:00:00.000Z', required: false })
  @Prop({ type: Date, default: null })
  interviewDate?: Date | null

  @ApiProperty({ example: 'Good communication skills.', required: false })
  @Prop({ default: '' })
  notes?: string
}

export const JobApplicantSchema = SchemaFactory.createForClass(JobApplicant)
JobApplicantSchema.index({ jobId: 1, status: 1 })
