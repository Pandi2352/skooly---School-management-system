import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator'
import { USER_LIMITS, USER_STATUSES, type UserStatus } from '../constants/user.constants'

export const USER_SORT_FIELDS = ['fullName', 'createdAt', 'lastLoginAt'] as const
export type UserSortField = (typeof USER_SORT_FIELDS)[number]

export class ListUsersQueryDto {
  @ApiPropertyOptional({ example: 'asha', description: 'Matches name or email, case-insensitive' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(USER_LIMITS.searchMax)
  search?: string

  @ApiPropertyOptional({ enum: USER_STATUSES, description: 'Only accounts in this state' })
  @IsOptional()
  @IsIn(USER_STATUSES, { message: `status must be one of: ${USER_STATUSES.join(', ')}.` })
  status?: UserStatus

  @ApiPropertyOptional({ format: 'uuid', description: 'Only accounts with this role' })
  @IsOptional()
  @IsUUID('4', { message: 'roleId must be a role id (UUID v4).' })
  roleId?: string

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20

  @ApiPropertyOptional({ enum: USER_SORT_FIELDS, default: 'fullName' })
  @IsOptional()
  @IsIn(USER_SORT_FIELDS, { message: `sortBy must be one of: ${USER_SORT_FIELDS.join(', ')}.` })
  sortBy: UserSortField = 'fullName'

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'sortOrder must be asc or desc.' })
  sortOrder: 'asc' | 'desc' = 'asc'
}
