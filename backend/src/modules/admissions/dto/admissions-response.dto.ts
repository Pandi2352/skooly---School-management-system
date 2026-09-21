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

  @ApiProperty({ example: '/mock/student_photo_boy.jpg' })
  photoUrl?: string

  @ApiProperty({ example: '', required: false })
  middleName?: string

  @ApiProperty({ example: 'General', required: false })
  category?: string

  @ApiProperty({ example: 'red', required: false })
  house?: string

  @ApiProperty({ example: 'Hindu', required: false })
  religion?: string

  @ApiProperty({ example: '1234 5678 9012', required: false })
  nationalId?: string

  @ApiProperty({ example: 'PEN-123456', required: false })
  penId?: string

  @ApiProperty({ example: 'Brahmin', required: false })
  caste?: string

  @ApiProperty({ example: 'Kashyap', required: false })
  subCaste?: string

  @ApiProperty({ example: 'Hindi', required: false })
  motherTongue?: string

  @ApiProperty({ example: 'Bangalore', required: false })
  placeOfBirth?: string

  @ApiProperty({ example: 'Indian', required: false })
  nationality?: string

  @ApiProperty({ example: false, required: false })
  belowPovertyLine?: boolean

  @ApiProperty({ example: false, required: false })
  rightToEducation?: boolean

  @ApiProperty({ example: '+91 98450 11223', required: false })
  phone?: string

  @ApiProperty({ example: 'rohan.verma@example.com', required: false })
  email?: string
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

  @ApiProperty({ example: 'Rajesh Verma', required: false })
  fatherName?: string

  @ApiProperty({ example: '+91 98450 11223', required: false })
  fatherPhone?: string

  @ApiProperty({ example: 'Software Architect', required: false })
  fatherOccupation?: string

  @ApiProperty({ example: 'B.Tech / M.Tech', required: false })
  fatherQualification?: string

  @ApiProperty({ example: '1234 5678 9012', required: false })
  fatherAadhaar?: string

  @ApiProperty({ example: 150000000, required: false })
  fatherIncomePaise?: number | null

  @ApiProperty({ example: 'Sunita Verma', required: false })
  motherName?: string

  @ApiProperty({ example: '+91 98450 44556', required: false })
  motherPhone?: string

  @ApiProperty({ example: 'Senior Professor', required: false })
  motherOccupation?: string

  @ApiProperty({ example: 'Ph.D. Mathematics', required: false })
  motherQualification?: string

  @ApiProperty({ example: '9876 5432 1098', required: false })
  motherAadhaar?: string

  @ApiProperty({ example: 'Mahesh Verma', required: false })
  emergencyName?: string

  @ApiProperty({ example: '+91 98450 99887', required: false })
  emergencyPhone?: string

  @ApiProperty({ example: '42 Orchid Residency, Indiranagar', required: false })
  permanentAddress?: string
}

export class ApplicantAcademicResponseDto {
  @ApiProperty({ example: 'ADM-2026-0001', required: false })
  admissionNo?: string

  @ApiProperty({ example: '001', required: false })
  rollNo?: string

  @ApiProperty({ example: '2026-04-01', required: false })
  admissionDate?: string

  @ApiProperty({ example: 'A', required: false })
  section?: string

  @ApiProperty({ example: 'BIO-991', required: false })
  biometricId?: string

  @ApiProperty({ example: 0, required: false })
  openingDuePaise?: number
}

export class ApplicantHealthResponseDto {
  @ApiProperty({ example: 'None', required: false })
  medicalConditions?: string

  @ApiProperty({ example: 'Peanuts', required: false })
  allergies?: string

  @ApiProperty({ example: '142', required: false })
  heightCm?: string

  @ApiProperty({ example: '36.5', required: false })
  weightKg?: string
}

export class ApplicantBankResponseDto {
  @ApiProperty({ example: 'Rohan Verma', required: false })
  accountHolder?: string

  @ApiProperty({ example: 'State Bank of India', required: false })
  bankName?: string

  @ApiProperty({ example: '123456789012', required: false })
  accountNumber?: string

  @ApiProperty({ example: 'SBIN0001234', required: false })
  ifsc?: string
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

  @ApiProperty({ type: ApplicantAcademicResponseDto, required: false })
  academic?: ApplicantAcademicResponseDto

  @ApiProperty({ type: ApplicantHealthResponseDto, required: false })
  health?: ApplicantHealthResponseDto

  @ApiProperty({ type: ApplicantBankResponseDto, required: false })
  bank?: ApplicantBankResponseDto

  @ApiProperty({ example: ['admission-2026'], required: false })
  feeGroupIds?: string[]

  @ApiProperty({ example: {}, required: false })
  customFields?: Record<string, string>

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
