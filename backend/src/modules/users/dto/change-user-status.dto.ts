import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator'
import { ASSIGNABLE_USER_STATUSES, USER_LIMITS, type AssignableUserStatus } from '../constants/user.constants'

export class ChangeUserStatusDto {
  @ApiProperty({
    enum: ASSIGNABLE_USER_STATUSES,
    description:
      'active: can sign in. suspended: kept, blocked, can be switched back on. archived: kept for history, never signs in again.',
    example: 'suspended',
  })
  @IsIn(ASSIGNABLE_USER_STATUSES, { message: `status must be one of: ${ASSIGNABLE_USER_STATUSES.join(', ')}.` })
  status: AssignableUserStatus

  @ApiPropertyOptional({ example: 'On long leave until April', description: 'Kept with the account for whoever looks later' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(USER_LIMITS.reasonMax)
  reason?: string
}
