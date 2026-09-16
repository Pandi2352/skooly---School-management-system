import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'

export type StudentDocument = HydratedDocument<Student>

@Schema({ collection: 'students' })
export class Student extends BaseSchema {
  @ApiProperty({ description: 'Admission Number', example: 'ADM-2026-0001' })
  @Prop({ required: true, unique: true, index: true })
  admissionNo: string

  @ApiProperty({ description: 'Roll Number', example: '101' })
  @Prop({ required: true })
  rollNo: string

  @ApiProperty({ description: 'Student Full Name', example: 'Aarav Sharma' })
  @Prop({ required: true })
  name: string

  @ApiProperty({ description: 'Academic Grade Level (e.g. 5 for Class 5)', example: 5 })
  @Prop({ required: true, index: true })
  grade: number

  @ApiProperty({ description: 'Section Division', example: 'A' })
  @Prop({ required: true })
  section: string

  @ApiProperty({ description: 'Parent / Guardian Contact Phone', example: '9876543210' })
  @Prop({ required: false })
  phone?: string

  @ApiProperty({ description: 'Enrollment Status', example: 'studying', enum: ['studying', 'pending', 'left'] })
  @Prop({ default: 'studying', index: true })
  status: string
}

export const StudentSchema = SchemaFactory.createForClass(Student)
