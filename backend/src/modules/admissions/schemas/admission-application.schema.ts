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

  @ApiProperty({ example: '/mock/student_photo_boy.jpg', required: false })
  @Prop({ default: '' })
  photoUrl?: string
  @ApiProperty({ example: '', required: false })
  @Prop({ default: '' })
  middleName?: string

  @ApiProperty({ example: 'General', required: false })
  @Prop({ default: '' })
  category?: string

  @ApiProperty({ example: 'red', required: false })
  @Prop({ default: '' })
  house?: string

  @ApiProperty({ example: 'Hindu', required: false })
  @Prop({ default: '' })
  religion?: string

  @ApiProperty({ example: '1234 5678 9012', required: false })
  @Prop({ default: '' })
  nationalId?: string

  @ApiProperty({ example: 'PEN-123456', required: false })
  @Prop({ default: '' })
  penId?: string

  @ApiProperty({ example: 'Brahmin', required: false })
  @Prop({ default: '' })
  caste?: string

  @ApiProperty({ example: 'Kashyap', required: false })
  @Prop({ default: '' })
  subCaste?: string

  @ApiProperty({ example: 'Hindi', required: false })
  @Prop({ default: '' })
  motherTongue?: string

  @ApiProperty({ example: 'Bangalore', required: false })
  @Prop({ default: '' })
  placeOfBirth?: string

  @ApiProperty({ example: 'Indian', required: false })
  @Prop({ default: 'Indian' })
  nationality?: string

  @ApiProperty({ example: false, required: false })
  @Prop({ type: Boolean, default: false })
  belowPovertyLine?: boolean

  @ApiProperty({ example: false, required: false })
  @Prop({ type: Boolean, default: false })
  rightToEducation?: boolean

  @ApiProperty({ example: '+91 98450 11223', required: false })
  @Prop({ default: '' })
  phone?: string

  @ApiProperty({ example: 'rohan.verma@example.com', required: false })
  @Prop({ default: '' })
  email?: string
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

  @ApiProperty({ example: 'Rajesh Verma', required: false })
  @Prop({ default: '' })
  fatherName?: string

  @ApiProperty({ example: '+91 98450 11223', required: false })
  @Prop({ default: '' })
  fatherPhone?: string

  @ApiProperty({ example: 'Software Architect', required: false })
  @Prop({ default: '' })
  fatherOccupation?: string

  @ApiProperty({ example: 'B.Tech / M.Tech', required: false })
  @Prop({ default: '' })
  fatherQualification?: string

  @ApiProperty({ example: '1234 5678 9012', required: false })
  @Prop({ default: '' })
  fatherAadhaar?: string

  @ApiProperty({ example: 150000000, required: false })
  @Prop({ type: Number, default: null })
  fatherIncomePaise?: number | null

  @ApiProperty({ example: 'Sunita Verma', required: false })
  @Prop({ default: '' })
  motherName?: string

  @ApiProperty({ example: '+91 98450 44556', required: false })
  @Prop({ default: '' })
  motherPhone?: string

  @ApiProperty({ example: 'Senior Professor', required: false })
  @Prop({ default: '' })
  motherOccupation?: string

  @ApiProperty({ example: 'Ph.D. Mathematics', required: false })
  @Prop({ default: '' })
  motherQualification?: string

  @ApiProperty({ example: '9876 5432 1098', required: false })
  @Prop({ default: '' })
  motherAadhaar?: string

  @ApiProperty({ example: 'Mahesh Verma', required: false })
  @Prop({ default: '' })
  emergencyName?: string

  @ApiProperty({ example: '+91 98450 99887', required: false })
  @Prop({ default: '' })
  emergencyPhone?: string

  @ApiProperty({ example: '42 Orchid Residency, Indiranagar', required: false })
  @Prop({ default: '' })
  permanentAddress?: string
}

export const ApplicantParentEmbeddedSchema = SchemaFactory.createForClass(ApplicantParentEmbedded)

@Schema({ _id: false })
export class ApplicantAcademicEmbedded {
  @ApiProperty({ example: 'ADM-2026-0001', required: false })
  @Prop({ default: '' })
  admissionNo?: string

  @ApiProperty({ example: '001', required: false })
  @Prop({ default: '' })
  rollNo?: string

  @ApiProperty({ example: '2026-04-01', required: false })
  @Prop({ default: '' })
  admissionDate?: string

  @ApiProperty({ example: 'A', required: false })
  @Prop({ default: '' })
  section?: string

  @ApiProperty({ example: 'BIO-991', required: false })
  @Prop({ default: '' })
  biometricId?: string

  @ApiProperty({ example: 0, required: false })
  @Prop({ type: Number, default: 0 })
  openingDuePaise?: number
}

export const ApplicantAcademicEmbeddedSchema = SchemaFactory.createForClass(ApplicantAcademicEmbedded)

@Schema({ _id: false })
export class ApplicantHealthEmbedded {
  @ApiProperty({ example: 'None', required: false })
  @Prop({ default: '' })
  medicalConditions?: string

  @ApiProperty({ example: 'Peanuts', required: false })
  @Prop({ default: '' })
  allergies?: string

  @ApiProperty({ example: '142', required: false })
  @Prop({ default: '' })
  heightCm?: string

  @ApiProperty({ example: '36.5', required: false })
  @Prop({ default: '' })
  weightKg?: string
}

export const ApplicantHealthEmbeddedSchema = SchemaFactory.createForClass(ApplicantHealthEmbedded)

@Schema({ _id: false })
export class ApplicantBankEmbedded {
  @ApiProperty({ example: 'Rohan Verma', required: false })
  @Prop({ default: '' })
  accountHolder?: string

  @ApiProperty({ example: 'State Bank of India', required: false })
  @Prop({ default: '' })
  bankName?: string

  @ApiProperty({ example: '123456789012', required: false })
  @Prop({ default: '' })
  accountNumber?: string

  @ApiProperty({ example: 'SBIN0001234', required: false })
  @Prop({ default: '' })
  ifsc?: string
}

export const ApplicantBankEmbeddedSchema = SchemaFactory.createForClass(ApplicantBankEmbedded)

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

  @ApiProperty({ type: ApplicantAcademicEmbedded, required: false })
  @Prop({ type: ApplicantAcademicEmbeddedSchema, default: () => ({}) })
  academic?: ApplicantAcademicEmbedded

  @ApiProperty({ type: ApplicantHealthEmbedded, required: false })
  @Prop({ type: ApplicantHealthEmbeddedSchema, default: () => ({}) })
  health?: ApplicantHealthEmbedded

  @ApiProperty({ type: ApplicantBankEmbedded, required: false })
  @Prop({ type: ApplicantBankEmbeddedSchema, default: () => ({}) })
  bank?: ApplicantBankEmbedded

  @ApiProperty({ example: ['admission-2026'], required: false })
  @Prop({ type: [String], default: [] })
  feeGroupIds?: string[]

  @ApiProperty({ example: {}, required: false })
  @Prop({ type: Object, default: {} })
  customFields?: Record<string, string>

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
