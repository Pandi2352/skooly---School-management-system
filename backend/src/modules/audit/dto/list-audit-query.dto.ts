import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator'
import { AUDIT_ACTIONS, type AuditAction } from '../audit.constants'

/** How far back to look. Anything longer than a month is the "everything kept" option. */
export const AUDIT_PERIODS = ['day', 'week', 'month', 'all'] as const
export type AuditPeriod = (typeof AUDIT_PERIODS)[number]

export class ListAuditQueryDto {
  @ApiPropertyOptional({ enum: AUDIT_ACTIONS, description: 'Only this kind of event' })
  @IsOptional()
  @IsIn(AUDIT_ACTIONS, { message: 'action must be one of the recorded event types.' })
  action?: AuditAction

  @ApiPropertyOptional({ format: 'uuid', description: 'Only events about this account' })
  @IsOptional()
  @IsUUID('4', { message: 'userId must be an account id (UUID v4).' })
  userId?: string

  @ApiPropertyOptional({ example: 'asha', description: 'Matches the person, the account or the summary' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(80)
  search?: string

  @ApiPropertyOptional({ enum: AUDIT_PERIODS, default: 'week', description: 'How far back to look' })
  @IsOptional()
  @IsIn(AUDIT_PERIODS, { message: `period must be one of: ${AUDIT_PERIODS.join(', ')}.` })
  period: AuditPeriod = 'week'

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @ApiPropertyOptional({ default: 25, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 25
}
