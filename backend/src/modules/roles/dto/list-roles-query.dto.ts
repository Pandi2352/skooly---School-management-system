import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator'
import { ROLE_KINDS, ROLE_LIMITS, type RoleKind } from '../constants/role.constants'

export class ListRolesQueryDto {
  @ApiPropertyOptional({ enum: ROLE_KINDS, description: 'Only system or only custom roles' })
  @IsOptional()
  @IsIn(ROLE_KINDS, { message: `kind must be one of: ${ROLE_KINDS.join(', ')}.` })
  kind?: RoleKind

  @ApiPropertyOptional({ example: 'teach', description: 'Matches role name or description, case-insensitive' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(ROLE_LIMITS.searchMax, { message: `search must be ${ROLE_LIMITS.searchMax} characters or fewer.` })
  search?: string
}
