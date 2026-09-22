import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { APPLICANT_STATUSES, DEPARTMENTS, JOB_STATUSES, type ApplicantStatus, type Department, type JobStatus } from '../constants/staff.constants'

export class CreateJobPostingDto {
  @ApiProperty({ example: 'Science Teacher – Grade 9 & 10' }) @IsString() title: string
  @ApiProperty({ enum: DEPARTMENTS }) @IsIn(DEPARTMENTS) department: Department
  @ApiProperty() @IsString() description: string
  @ApiPropertyOptional() @IsOptional() @IsString() requirements?: string
  @ApiPropertyOptional({ example: '2026-05-31' }) @IsOptional() @IsString() closingDate?: string
  @ApiPropertyOptional({ example: 2 }) @IsOptional() @IsInt() @Min(1) vacancies?: number
}

export class UpdateJobPostingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string
  @ApiPropertyOptional({ enum: DEPARTMENTS }) @IsOptional() @IsIn(DEPARTMENTS) department?: Department
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string
  @ApiPropertyOptional() @IsOptional() @IsString() requirements?: string
  @ApiPropertyOptional({ enum: JOB_STATUSES }) @IsOptional() @IsIn(JOB_STATUSES) status?: JobStatus
  @ApiPropertyOptional() @IsOptional() @IsString() closingDate?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) vacancies?: number
}

export class CreateJobApplicantDto {
  @ApiProperty({ example: 'uuid-of-job' }) @IsString() jobId: string
  @ApiProperty({ example: 'Ramesh Kumar' }) @IsString() name: string
  @ApiProperty({ example: 'ramesh@gmail.com' }) @IsString() email: string
  @ApiProperty({ example: '+91 98765 00001' }) @IsString() phone: string
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string
}

export class UpdateApplicantStatusDto {
  @ApiProperty({ enum: APPLICANT_STATUSES }) @IsIn(APPLICANT_STATUSES) status: ApplicantStatus
  @ApiPropertyOptional() @IsOptional() @IsString() interviewDate?: string
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string
}
