import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, IsUUID, Length, Matches, MaxLength, ValidateIf } from 'class-validator'
import { ROLE_LIMITS, ROLE_NAME_PATTERN } from '../constants/role.constants'
import { cleanRoleName } from '../utils/role.util'

const trimText = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

export class CreateRoleDto {
  @ApiProperty({ example: 'Transport Manager', minLength: ROLE_LIMITS.nameMin, maxLength: ROLE_LIMITS.nameMax })
  @Transform(({ value }) => (typeof value === 'string' ? cleanRoleName(value) : value))
  @IsString({ message: 'Role name must be text.' })
  @Length(ROLE_LIMITS.nameMin, ROLE_LIMITS.nameMax, {
    message: `Role name must be between ${ROLE_LIMITS.nameMin} and ${ROLE_LIMITS.nameMax} characters.`,
  })
  @Matches(ROLE_NAME_PATTERN, {
    message: "Role name can use letters, numbers, spaces and & ' ( ) . / -, and must start with a letter or number.",
  })
  name: string

  @ApiPropertyOptional({
    example: 'Looks after bus routes, stops, drivers and transport fees.',
    maxLength: ROLE_LIMITS.descriptionMax,
    default: '',
  })
  @IsOptional()
  @Transform(trimText)
  @IsString({ message: 'Description must be text.' })
  @MaxLength(ROLE_LIMITS.descriptionMax, {
    message: `Description must be ${ROLE_LIMITS.descriptionMax} characters or fewer.`,
  })
  description?: string

  @ApiPropertyOptional({
    description: 'Id of a role to copy permissions from; omit or null to start with none',
    example: '6f1d2c3b-4a5e-4f60-9b7a-8c9d0e1f2a3b',
    nullable: true,
    format: 'uuid',
  })
  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsUUID('4', { message: 'copyFromRoleId must be a valid UUID.' })
  copyFromRoleId?: string | null
}
