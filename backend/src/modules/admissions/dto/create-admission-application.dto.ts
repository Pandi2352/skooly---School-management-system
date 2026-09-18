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

  @ApiProperty({ type: [ApplicantDocumentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicantDocumentDto)
  documents?: ApplicantDocumentDto[]
}
