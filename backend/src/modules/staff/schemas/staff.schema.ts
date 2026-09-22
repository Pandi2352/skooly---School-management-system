import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import {
  DEPARTMENTS,
  EMPLOYMENT_STATUSES,
  EMPLOYMENT_TYPES,
  type Department,
  type EmploymentStatus,
  type EmploymentType,
} from '../constants/staff.constants'

export type StaffDocument = HydratedDocument<Staff>

// ── Embedded sub-documents ──────────────────────────────────────────────────

@Schema({ _id: false })
export class StaffQualificationEmbedded {
  @ApiProperty({ example: 'B.Ed.' })
  @Prop({ required: true, trim: true })
  degree: string

  @ApiProperty({ example: 'Bangalore University' })
  @Prop({ required: true, trim: true })
  institution: string

  @ApiProperty({ example: '2010' })
  @Prop({ required: true })
  year: string

  @ApiProperty({ example: 'First Class', required: false })
  @Prop({ type: String, default: '' })
  grade?: string
}

@Schema({ _id: false })
export class StaffExperienceEmbedded {
  @ApiProperty({ example: 'Delhi Public School, Pune' })
  @Prop({ required: true, trim: true })
  institution: string

  @ApiProperty({ example: 'Mathematics Teacher' })
  @Prop({ required: true, trim: true })
  designation: string

  @ApiProperty({ example: '2012-06-01' })
  @Prop({ required: true })
  from: string

  @ApiProperty({ example: '2018-03-31' })
  @Prop({ type: String, default: '' })
  to?: string

  @ApiProperty({ example: false })
  @Prop({ default: false })
  isCurrent: boolean
}

@Schema({ _id: false })
export class StaffPersonalInfoEmbedded {
  @ApiProperty({ example: 'Priya' })
  @Prop({ required: true, trim: true })
  firstName: string

  @ApiProperty({ example: '', required: false })
  @Prop({ type: String, default: '' })
  middleName?: string

  @ApiProperty({ example: 'Sharma' })
  @Prop({ required: true, trim: true })
  lastName: string

  @ApiProperty({ example: '1988-03-15' })
  @Prop({ required: true })
  dateOfBirth: string

  @ApiProperty({ example: 'female' })
  @Prop({ required: true })
  gender: string

  @ApiProperty({ example: 'B+', required: false })
  @Prop({ type: String, default: '' })
  bloodGroup?: string

  @ApiProperty({ example: '1234 5678 9012', required: false })
  @Prop({ type: String, default: '' })
  aadhaarNumber?: string

  @ApiProperty({ example: 'ABCDE1234F', required: false })
  @Prop({ type: String, default: '' })
  panNumber?: string

  @ApiProperty({ example: 'Hindu', required: false })
  @Prop({ type: String, default: '' })
  religion?: string

  @ApiProperty({ example: 'General', required: false })
  @Prop({ type: String, default: '' })
  category?: string
}

@Schema({ _id: false })
export class StaffContactInfoEmbedded {
  @ApiProperty({ example: '+91 98450 11223' })
  @Prop({ required: true })
  phone: string

  @ApiProperty({ example: '+91 90000 22334', required: false })
  @Prop({ type: String, default: '' })
  altPhone?: string

  @ApiProperty({ example: 'priya.sharma@schoolerp.in', required: false })
  @Prop({ type: String, default: '' })
  email?: string

  @ApiProperty({ example: '12 MG Road, Bengaluru 560001', required: false })
  @Prop({ type: String, default: '' })
  address?: string
}

@Schema({ _id: false })
export class StaffEmploymentEmbedded {
  @ApiProperty({ example: 'EMP-0001' })
  @Prop({ required: true, trim: true })
  employeeId: string

  @ApiProperty({ example: 'Mathematics Teacher' })
  @Prop({ required: true, trim: true })
  designation: string

  @ApiProperty({ example: 'Secondary' })
  @Prop({ required: true, enum: DEPARTMENTS })
  department: Department

  @ApiProperty({ example: '2018-06-01' })
  @Prop({ required: true })
  dateOfJoining: string

  @ApiProperty({ example: 'permanent', enum: EMPLOYMENT_TYPES })
  @Prop({ required: true, enum: EMPLOYMENT_TYPES })
  employmentType: EmploymentType

  @ApiProperty({ example: 'active', enum: EMPLOYMENT_STATUSES })
  @Prop({ required: true, enum: EMPLOYMENT_STATUSES, default: 'active' })
  status: EmploymentStatus

  @ApiProperty({ example: 4500000, description: 'Gross monthly salary in paise', required: false })
  @Prop({ type: Number, default: 0 })
  salaryPaise?: number

  @ApiProperty({ example: '', required: false })
  @Prop({ type: String, default: '' })
  reportingTo?: string

  @ApiProperty({ example: '', required: false })
  @Prop({ type: String, default: '' })
  dateOfLeaving?: string
}

@Schema({ _id: false })
export class StaffLeaveBalanceEmbedded {
  @ApiProperty({ example: 12 })
  @Prop({ type: Number, default: 12 })
  casual: number

  @ApiProperty({ example: 12 })
  @Prop({ type: Number, default: 12 })
  medical: number

  @ApiProperty({ example: 15 })
  @Prop({ type: Number, default: 15 })
  earned: number

  @ApiProperty({ example: 90 })
  @Prop({ type: Number, default: 0 })
  maternity: number

  @ApiProperty({ example: 15 })
  @Prop({ type: Number, default: 0 })
  paternity: number
}

// ── Main document ────────────────────────────────────────────────────────────

@Schema({ timestamps: true })
export class Staff extends BaseSchema {
  @ApiProperty()
  @Prop({ type: StaffPersonalInfoEmbedded, required: true })
  personalInfo: StaffPersonalInfoEmbedded

  @ApiProperty()
  @Prop({ type: StaffContactInfoEmbedded, required: true })
  contactInfo: StaffContactInfoEmbedded

  @ApiProperty()
  @Prop({ type: StaffEmploymentEmbedded, required: true })
  employment: StaffEmploymentEmbedded

  @ApiProperty({ type: [StaffQualificationEmbedded] })
  @Prop({ type: [StaffQualificationEmbedded], default: [] })
  qualifications: StaffQualificationEmbedded[]

  @ApiProperty({ type: [StaffExperienceEmbedded] })
  @Prop({ type: [StaffExperienceEmbedded], default: [] })
  experience: StaffExperienceEmbedded[]

  @ApiProperty({ example: '/uploads/staff/photo-uuid.jpg', required: false })
  @Prop({ type: String, default: '' })
  photoUrl?: string

  @ApiProperty({ required: false })
  @Prop({ type: String, default: '' })
  resumeUrl?: string

  @ApiProperty()
  @Prop({ type: StaffLeaveBalanceEmbedded, default: () => ({}) })
  leaveBalance: StaffLeaveBalanceEmbedded

  @ApiProperty({ example: ['Mathematics', 'Physics'] })
  @Prop({ type: [String], default: [] })
  subjects: string[]

  @ApiProperty({ example: ['9', '10', '11'] })
  @Prop({ type: [String], default: [] })
  classes: string[]

  @ApiProperty({ example: 'Some notes about the staff member', required: false })
  @Prop({ type: String, default: '' })
  notes?: string
}

export const StaffSchema = SchemaFactory.createForClass(Staff)

// Text index for search
StaffSchema.index({
  'personalInfo.firstName': 'text',
  'personalInfo.lastName': 'text',
  'personalInfo.middleName': 'text',
  'employment.employeeId': 'text',
  'employment.designation': 'text',
  'contactInfo.phone': 'text',
  'contactInfo.email': 'text',
})
