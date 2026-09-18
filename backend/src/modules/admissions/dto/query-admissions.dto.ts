import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ADMISSION_STATUSES, type AdmissionStatus } from '../constants/admissions.constants'

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
  search?: string

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
