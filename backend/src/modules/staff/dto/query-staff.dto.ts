import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import {
  DEPARTMENTS,
  EMPLOYMENT_STATUSES,
  type Department,
  type EmploymentStatus,
} from '../constants/staff.constants'

export class QueryStaffDto {
  @ApiPropertyOptional({ example: 'Priya' })
  @IsOptional() @IsString()
  search?: string

  @ApiPropertyOptional({ enum: DEPARTMENTS })
  @IsOptional() @IsIn(DEPARTMENTS)
  department?: Department

  @ApiPropertyOptional({ enum: EMPLOYMENT_STATUSES })
  @IsOptional() @IsIn(EMPLOYMENT_STATUSES)
  status?: EmploymentStatus

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number

  @ApiPropertyOptional({ example: 20 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number

  @ApiPropertyOptional({ example: 'name' })
  @IsOptional() @IsString()
  sort?: string
}
