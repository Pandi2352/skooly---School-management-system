import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { LEAVE_STATUSES, LEAVE_TYPES, type LeaveStatus, type LeaveType } from '../constants/staff.constants'

export class CreateLeaveApplicationDto {
  @ApiProperty({ example: 'uuid-of-staff' })
  @IsString()
  staffId: string

  @ApiProperty({ enum: LEAVE_TYPES })
  @IsIn(LEAVE_TYPES)
  leaveType: LeaveType

  @ApiProperty({ example: '2026-04-05' })
  @IsString()
  fromDate: string

  @ApiProperty({ example: '2026-04-07' })
  @IsString()
  toDate: string

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0.5)
  days: number

  @ApiProperty({ example: 'Attending family function' })
  @IsString()
  reason: string
}

export class UpdateLeaveStatusDto {
  @ApiProperty({ enum: LEAVE_STATUSES })
  @IsIn(LEAVE_STATUSES)
  status: LeaveStatus

  @ApiPropertyOptional({ example: 'Approved. Enjoy.' })
  @IsOptional()
  @IsString()
  remarks?: string
}

export class QueryLeavesDto {
  @ApiPropertyOptional({ example: 'uuid-of-staff' })
  @IsOptional() @IsString()
  staffId?: string

  @ApiPropertyOptional({ enum: LEAVE_TYPES })
  @IsOptional() @IsIn(LEAVE_TYPES)
  leaveType?: LeaveType

  @ApiPropertyOptional({ enum: LEAVE_STATUSES })
  @IsOptional() @IsIn(LEAVE_STATUSES)
  status?: LeaveStatus

  @ApiPropertyOptional({ example: '2026-04-01' })
  @IsOptional() @IsString()
  from?: string

  @ApiPropertyOptional({ example: '2026-04-30' })
  @IsOptional() @IsString()
  to?: string
}
