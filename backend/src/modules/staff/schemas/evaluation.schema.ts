import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'

export type StaffEvaluationDocument = HydratedDocument<StaffEvaluation>

@Schema({ _id: false })
export class EvaluationScoresEmbedded {
  @ApiProperty({ example: 4, description: '1–5' })
  @Prop({ type: Number, required: true, min: 1, max: 5 })
  subjectKnowledge: number

  @ApiProperty({ example: 4 })
  @Prop({ type: Number, required: true, min: 1, max: 5 })
  classroomManagement: number

  @ApiProperty({ example: 3 })
  @Prop({ type: Number, required: true, min: 1, max: 5 })
  communication: number

  @ApiProperty({ example: 4 })
  @Prop({ type: Number, required: true, min: 1, max: 5 })
  punctuality: number

  @ApiProperty({ example: 5 })
  @Prop({ type: Number, required: true, min: 1, max: 5 })
  teamwork: number
}

@Schema({ timestamps: true })
export class StaffEvaluation extends BaseSchema {
  @ApiProperty({ example: 'uuid-of-staff' })
  @Prop({ type: String, required: true, index: true })
  staffId: string

  @ApiProperty({ example: 'uuid-of-evaluator', required: false })
  @Prop({ type: String, default: null })
  evaluatorId?: string | null

  @ApiProperty({ example: 'Principal' })
  @Prop({ required: true, trim: true })
  evaluatorRole: string

  @ApiProperty({ example: 'Annual 2025-26' })
  @Prop({ required: true, trim: true })
  period: string

  @ApiProperty()
  @Prop({ type: EvaluationScoresEmbedded, required: true })
  scores: EvaluationScoresEmbedded

  @ApiProperty({ example: 4.0 })
  @Prop({ type: Number, required: true, min: 1, max: 5 })
  overallRating: number

  @ApiProperty({ example: 'Excellent classroom engagement.', required: false })
  @Prop({ default: '' })
  comments?: string
}

export const StaffEvaluationSchema = SchemaFactory.createForClass(StaffEvaluation)
