import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'
import { ADMISSION_STATUSES, type AdmissionStatus } from '../constants/admissions.constants'

/** Whether every document an applicant sent has been checked. */
export const DOCUMENT_FILTERS = ['all', 'verified', 'pending'] as const
export type DocumentFilter = (typeof DOCUMENT_FILTERS)[number]

export const ADMISSION_SORTS = ['newest', 'oldest', 'name', 'grade'] as const
export type AdmissionSort = (typeof ADMISSION_SORTS)[number]

export class QueryAdmissionsDto {
  @ApiProperty({ required: false, enum: ADMISSION_STATUSES })
  @IsOptional()
  @IsIn(ADMISSION_STATUSES)
  status?: AdmissionStatus

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  grade?: number

  @ApiProperty({ required: false, example: 'Rohan' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  search?: string

  @ApiProperty({ required: false, enum: DOCUMENT_FILTERS, default: 'all', description: 'Whether every document has been verified' })
  @IsOptional()
  @IsIn(DOCUMENT_FILTERS, { message: `documents must be one of: ${DOCUMENT_FILTERS.join(', ')}.` })
  documents?: DocumentFilter

  @ApiProperty({ required: false, example: '2026-02-01', description: 'Applications sent on or after this date' })
  @IsOptional()
  @IsDateString({}, { message: 'appliedFrom must be a date, like 2026-02-01.' })
  appliedFrom?: string

  @ApiProperty({ required: false, example: '2026-03-31', description: 'Applications sent on or before this date' })
  @IsOptional()
  @IsDateString({}, { message: 'appliedTo must be a date, like 2026-03-31.' })
  appliedTo?: string

  @ApiProperty({ required: false, enum: ADMISSION_SORTS, default: 'newest' })
  @IsOptional()
  @IsIn(ADMISSION_SORTS, { message: `sort must be one of: ${ADMISSION_SORTS.join(', ')}.` })
  sort?: AdmissionSort

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20
}
