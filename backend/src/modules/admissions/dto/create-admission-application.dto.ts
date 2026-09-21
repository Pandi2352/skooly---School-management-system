import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { DOCUMENT_STATUSES, type DocumentStatus } from '../constants/admissions.constants'

export class ApplicantStudentDto {
  @ApiProperty({ example: 'Rohan' })
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Verma' })
  @IsString()
  lastName: string

  @ApiProperty({ example: '2016-04-12' })
  @IsString()
  dateOfBirth: string

  @ApiProperty({ example: 'male' })
  @IsString()
  gender: string

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(12)
  gradeApplied: number

  @ApiProperty({ example: 'B+', required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string

  @ApiProperty({ example: 'St. Xavier Kindergarten', required: false })
  @IsOptional()
  @IsString()
  previousSchool?: string

  @ApiProperty({ example: '/mock/student_photo_boy.jpg', required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  middleName?: string

  @ApiProperty({ example: 'General', required: false })
  @IsOptional()
  @IsString()
  category?: string

  @ApiProperty({ example: 'red', required: false })
  @IsOptional()
  @IsString()
  house?: string

  @ApiProperty({ example: 'Hindu', required: false })
  @IsOptional()
  @IsString()
  religion?: string

  @ApiProperty({ example: '1234 5678 9012', required: false })
  @IsOptional()
  @IsString()
  nationalId?: string

  @ApiProperty({ example: 'PEN-123456', required: false })
  @IsOptional()
  @IsString()
  penId?: string

  @ApiProperty({ example: 'Brahmin', required: false })
  @IsOptional()
  @IsString()
  caste?: string

  @ApiProperty({ example: 'Kashyap', required: false })
  @IsOptional()
  @IsString()
  subCaste?: string

  @ApiProperty({ example: 'Hindi', required: false })
  @IsOptional()
  @IsString()
  motherTongue?: string

  @ApiProperty({ example: 'Bangalore', required: false })
  @IsOptional()
  @IsString()
  placeOfBirth?: string

  @ApiProperty({ example: 'Indian', required: false })
  @IsOptional()
  @IsString()
  nationality?: string

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  belowPovertyLine?: boolean

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  rightToEducation?: boolean

  @ApiProperty({ example: '+91 98450 11223', required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ example: 'rohan.verma@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string
}

export class ApplicantParentDto {
  @ApiProperty({ example: 'father' })
  @IsString()
  guardianType: string

  @ApiProperty({ example: 'Rajesh Verma' })
  @IsString()
  name: string

  @ApiProperty({ example: 'rajesh.verma@techcorp.in' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '+91 98450 11223' })
  @IsString()
  phone: string

  @ApiProperty({ example: 'Software Architect', required: false })
  @IsOptional()
  @IsString()
  occupation?: string

  @ApiProperty({ example: '42 Indiranagar', required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ example: 'Rajesh Verma', required: false })
  @IsOptional()
  @IsString()
  fatherName?: string

  @ApiProperty({ example: '+91 98450 11223', required: false })
  @IsOptional()
  @IsString()
  fatherPhone?: string

  @ApiProperty({ example: 'Software Architect', required: false })
  @IsOptional()
  @IsString()
  fatherOccupation?: string

  @ApiProperty({ example: 'B.Tech / M.Tech', required: false })
  @IsOptional()
  @IsString()
  fatherQualification?: string

  @ApiProperty({ example: '1234 5678 9012', required: false })
  @IsOptional()
  @IsString()
  fatherAadhaar?: string

  @ApiProperty({ example: 150000000, required: false })
  @IsOptional()
  @IsInt()
  fatherIncomePaise?: number | null

  @ApiProperty({ example: 'Sunita Verma', required: false })
  @IsOptional()
  @IsString()
  motherName?: string

  @ApiProperty({ example: '+91 98450 44556', required: false })
  @IsOptional()
  @IsString()
  motherPhone?: string

  @ApiProperty({ example: 'Senior Professor', required: false })
  @IsOptional()
  @IsString()
  motherOccupation?: string

  @ApiProperty({ example: 'Ph.D. Mathematics', required: false })
  @IsOptional()
  @IsString()
  motherQualification?: string

  @ApiProperty({ example: '9876 5432 1098', required: false })
  @IsOptional()
  @IsString()
  motherAadhaar?: string

  @ApiProperty({ example: 'Mahesh Verma', required: false })
  @IsOptional()
  @IsString()
  emergencyName?: string

  @ApiProperty({ example: '+91 98450 99887', required: false })
  @IsOptional()
  @IsString()
  emergencyPhone?: string

  @ApiProperty({ example: '42 Orchid Residency, Indiranagar', required: false })
  @IsOptional()
  @IsString()
  permanentAddress?: string
}

export class AcademicDetailsDto {
  @ApiProperty({ example: 'ADM-2026-0001', required: false })
  @IsOptional()
  @IsString()
  admissionNo?: string

  @ApiProperty({ example: '001', required: false })
  @IsOptional()
  @IsString()
  rollNo?: string

  @ApiProperty({ example: '2026-04-01', required: false })
  @IsOptional()
  @IsString()
  admissionDate?: string

  @ApiProperty({ example: 'A', required: false })
  @IsOptional()
  @IsString()
  section?: string

  @ApiProperty({ example: 'BIO-991', required: false })
  @IsOptional()
  @IsString()
  biometricId?: string

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  openingDuePaise?: number
}

export class HealthDetailsDto {
  @ApiProperty({ example: 'None', required: false })
  @IsOptional()
  @IsString()
  medicalConditions?: string

  @ApiProperty({ example: 'Peanuts', required: false })
  @IsOptional()
  @IsString()
  allergies?: string

  @ApiProperty({ example: '142', required: false })
  @IsOptional()
  @IsString()
  heightCm?: string

  @ApiProperty({ example: '36.5', required: false })
  @IsOptional()
  @IsString()
  weightKg?: string
}

export class BankDetailsDto {
  @ApiProperty({ example: 'Rohan Verma', required: false })
  @IsOptional()
  @IsString()
  accountHolder?: string

  @ApiProperty({ example: 'State Bank of India', required: false })
  @IsOptional()
  @IsString()
  bankName?: string

  @ApiProperty({ example: '123456789012', required: false })
  @IsOptional()
  @IsString()
  accountNumber?: string

  @ApiProperty({ example: 'SBIN0001234', required: false })
  @IsOptional()
  @IsString()
  ifsc?: string
}

export class ApplicantDocumentDto {
  @ApiProperty({ example: 'Birth Certificate' })
  @IsString()
  name: string

  @ApiProperty({ enum: DOCUMENT_STATUSES, example: 'submitted' })
  @IsIn(DOCUMENT_STATUSES)
  status: DocumentStatus

  @ApiProperty({ example: 'https://docs.skooly.edu/uploads/cert.pdf', required: false })
  @IsOptional()
  @IsString()
  fileUrl?: string
}

export class CreateAdmissionApplicationDto {
  @ApiProperty({ type: ApplicantStudentDto })
  @ValidateNested()
  @Type(() => ApplicantStudentDto)
  student: ApplicantStudentDto

  @ApiProperty({ type: ApplicantParentDto })
  @ValidateNested()
  @Type(() => ApplicantParentDto)
  parent: ApplicantParentDto

  @ApiProperty({ type: AcademicDetailsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AcademicDetailsDto)
  academic?: AcademicDetailsDto

  @ApiProperty({ type: HealthDetailsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => HealthDetailsDto)
  health?: HealthDetailsDto

  @ApiProperty({ type: BankDetailsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bank?: BankDetailsDto

  @ApiProperty({ example: ['admission-2026'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  feeGroupIds?: string[]

  @ApiProperty({ example: {}, required: false })
  @IsOptional()
  customFields?: Record<string, string>

  @ApiProperty({ type: [ApplicantDocumentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicantDocumentDto)
  documents?: ApplicantDocumentDto[]
}
