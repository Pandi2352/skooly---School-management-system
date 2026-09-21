import { ApiProperty } from '@nestjs/swagger'
import {
  AdmissionStatus,
  DocumentStatus,
} from '../constants/admissions.constants'

export class ApplicantStudentResponseDto {
  @ApiProperty({ example: 'Rohan' })
  firstName: string

  @ApiProperty({ example: 'Verma' })
  lastName: string

  @ApiProperty({ example: '2016-04-12' })
  dateOfBirth: string

  @ApiProperty({ example: 'male' })
  gender: string

  @ApiProperty({ example: 5 })
  gradeApplied: number

  @ApiProperty({ example: 'B+' })
  bloodGroup?: string

  @ApiProperty({ example: 'St. Xavier Kindergarten' })
  previousSchool?: string
}

export class ApplicantParentResponseDto {
  @ApiProperty({ example: 'father' })
  guardianType: string

  @ApiProperty({ example: 'Rajesh Verma' })
  name: string

  @ApiProperty({ example: 'rajesh.verma@techcorp.in' })
  email: string

  @ApiProperty({ example: '+91 98450 11223' })
  phone: string

  @ApiProperty({ example: 'Software Architect' })
  occupation?: string

  @ApiProperty({ example: '42 Orchid Residency' })
  address?: string
}

export class ApplicantDocumentResponseDto {
  @ApiProperty({ example: 'Birth Certificate' })
  name: string

  @ApiProperty({ example: 'verified' })
  status: DocumentStatus

  @ApiProperty({ example: '' })
  fileUrl?: string
}

export class AdmissionApplicationResponseDto {
  @ApiProperty({ example: '65f1234567890abcdef12345' })
  _id: string

  @ApiProperty({ example: 'APP-2026-001' })
  applicationNo: string

  @ApiProperty({ type: ApplicantStudentResponseDto })
  student: ApplicantStudentResponseDto

  @ApiProperty({ type: ApplicantParentResponseDto })
  parent: ApplicantParentResponseDto

  @ApiProperty({ type: [ApplicantDocumentResponseDto] })
  documents: ApplicantDocumentResponseDto[]

  @ApiProperty({ example: 'under-review' })
  status: AdmissionStatus

  @ApiProperty({ example: '2026-03-01T09:30:00.000Z' })
  appliedAt: Date

  @ApiProperty({ required: false })
  reviewedAt?: Date

  @ApiProperty({ required: false })
  reviewerNotes?: string

  @ApiProperty({ required: false })
  enrolledStudentId?: string

  @ApiProperty({ required: false })
  createdAt?: Date

  @ApiProperty({ required: false })
  updatedAt?: Date
}

export class AdmissionGradeCountDto {
  @ApiProperty({ example: 5 })
  grade: number

  @ApiProperty({ example: 7 })
  count: number
}

export class AdmissionDayCountDto {
  @ApiProperty({ example: '2026-03-04' })
  day: string

  @ApiProperty({ example: 3 })
  count: number
}

export class AdmissionStatsResponseDto {
  @ApiProperty({ example: 42 })
  total: number

  @ApiProperty({ example: 12 })
  underReview: number

  @ApiProperty({ example: 18 })
  approved: number

  @ApiProperty({ example: 8 })
  enrolled: number

  @ApiProperty({ example: 4 })
  rejected: number

  @ApiProperty({ type: [AdmissionGradeCountDto], description: 'Applications per grade, lowest grade first' })
  byGrade: AdmissionGradeCountDto[]

  @ApiProperty({
    type: [AdmissionDayCountDto],
    description: 'Applications per day over the recent window, including days with none',
  })
  byDay: AdmissionDayCountDto[]

  @ApiProperty({ example: 30, description: 'How many days the byDay window covers' })
  windowDays: number
}

export class PaginatedAdmissionsResponseDto {
  @ApiProperty({ type: [AdmissionApplicationResponseDto] })
  items: AdmissionApplicationResponseDto[]

  @ApiProperty({ example: 42 })
  total: number

  @ApiProperty({ example: 1 })
  page: number

  @ApiProperty({ example: 20 })
  limit: number

  @ApiProperty({ example: 3 })
  totalPages: number
}
