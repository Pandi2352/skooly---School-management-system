import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'
import { ADMISSION_STATUSES, type AdmissionStatus } from '../constants/admissions.constants'

export class UpdateAdmissionStatusDto {
  @ApiProperty({ enum: ADMISSION_STATUSES, example: 'approved' })
  @IsIn(ADMISSION_STATUSES)
  status: AdmissionStatus

  @ApiProperty({ example: 'Verified all certificates and approved admission.', required: false })
  @IsOptional()
  @IsString()
  reviewerNotes?: string
}

export class EnrollApplicantDto {
  @ApiProperty({ example: 'ADM-2026-0042', required: false })
  @IsOptional()
  @IsString()
  admissionNo?: string

  @ApiProperty({ example: '101', required: false })
  @IsOptional()
  @IsString()
  rollNo?: string

  @ApiProperty({ example: 'A', default: 'A' })
  @IsString()
  section: string
}
