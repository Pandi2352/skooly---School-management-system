import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import {
  ADMISSION_STATUSES,
  DOCUMENT_STATUSES,
  type AdmissionStatus,
  type DocumentStatus,
} from '../constants/admissions.constants'

@Schema({ _id: false })
export class ApplicantStudentEmbedded {
  @ApiProperty({ example: 'Rohan' })
  @Prop({ required: true, trim: true })
  firstName: string

  @ApiProperty({ example: 'Verma' })
  @Prop({ required: true, trim: true })
  lastName: string

  @ApiProperty({ example: '2016-04-12' })
  @Prop({ required: true })
  dateOfBirth: string

  @ApiProperty({ example: 'male' })
  @Prop({ required: true })
  gender: string

  @ApiProperty({ example: 5 })
  @Prop({ required: true, min: 1, max: 12 })
  gradeApplied: number

  @ApiProperty({ example: 'B+', required: false })
  @Prop({ default: '' })
  bloodGroup?: string

  @ApiProperty({ example: 'St. Xavier Kindergarten', required: false })
  @Prop({ default: '' })
  previousSchool?: string
}

export const ApplicantStudentEmbeddedSchema = SchemaFactory.createForClass(ApplicantStudentEmbedded)

@Schema({ _id: false })
export class ApplicantParentEmbedded {
  @ApiProperty({ example: 'father' })
  @Prop({ required: true, default: 'father' })
  guardianType: string

  @ApiProperty({ example: 'Rajesh Verma' })
  @Prop({ required: true, trim: true })
  name: string

  @ApiProperty({ example: 'rajesh.verma@techcorp.in' })
  @Prop({ required: true, trim: true })
  email: string

  @ApiProperty({ example: '+91 98450 11223' })
  @Prop({ required: true, trim: true })
  phone: string

  @ApiProperty({ example: 'Software Architect', required: false })
  @Prop({ default: '' })
  occupation?: string

  @ApiProperty({ example: '42 Orchid Residency, Indiranagar', required: false })
  @Prop({ default: '' })
  address?: string
}

export const ApplicantParentEmbeddedSchema = SchemaFactory.createForClass(ApplicantParentEmbedded)

@Schema({ _id: false })
export class ApplicantDocumentEmbedded {
  @ApiProperty({ example: 'Birth Certificate' })
  @Prop({ required: true })
  name: string

  @ApiProperty({ enum: DOCUMENT_STATUSES, example: 'verified' })
  @Prop({ required: true, enum: DOCUMENT_STATUSES, default: 'submitted' })
  status: DocumentStatus

  @ApiProperty({ example: 'https://docs.skooly.edu/uploads/cert.pdf', required: false })
  @Prop({ default: '' })
  fileUrl?: string
}

export const ApplicantDocumentEmbeddedSchema = SchemaFactory.createForClass(ApplicantDocumentEmbedded)

export type AdmissionApplicationDocument = HydratedDocument<AdmissionApplication>

@Schema({ collection: 'admission_applications', timestamps: true, versionKey: false })
export class AdmissionApplication extends BaseSchema {
  @ApiProperty({ example: 'APP-2026-001' })
  @Prop({ required: true, unique: true, index: true, trim: true })
  applicationNo: string

  @ApiProperty({ type: ApplicantStudentEmbedded })
  @Prop({ type: ApplicantStudentEmbeddedSchema, required: true })
  student: ApplicantStudentEmbedded

  @ApiProperty({ type: ApplicantParentEmbedded })
  @Prop({ type: ApplicantParentEmbeddedSchema, required: true })
  parent: ApplicantParentEmbedded

  @ApiProperty({ type: [ApplicantDocumentEmbedded] })
  @Prop({ type: [ApplicantDocumentEmbeddedSchema], default: [] })
  documents: ApplicantDocumentEmbedded[]

  @ApiProperty({ enum: ADMISSION_STATUSES, example: 'under-review' })
  @Prop({ required: true, enum: ADMISSION_STATUSES, default: 'under-review', index: true })
  status: AdmissionStatus

  @ApiProperty({ example: '2026-03-01T09:30:00.000Z' })
  @Prop({ required: true, default: () => new Date() })
  appliedAt: Date

  @ApiProperty({ required: false })
  @Prop({ required: false })
  reviewedAt?: Date

  @ApiProperty({ required: false })
  @Prop({ default: '' })
  reviewerNotes?: string

  @ApiProperty({ required: false })
  @Prop({ required: false })
  enrolledStudentId?: string
}

export const AdmissionApplicationSchema = SchemaFactory.createForClass(AdmissionApplication)

AdmissionApplicationSchema.index({ 'student.gradeApplied': 1, status: 1 })
AdmissionApplicationSchema.index({ 'student.firstName': 'text', 'student.lastName': 'text', applicationNo: 'text' })
