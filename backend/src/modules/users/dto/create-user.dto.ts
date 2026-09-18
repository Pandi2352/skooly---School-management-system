import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator'
import { PASSWORD_LIMITS } from '../../../common/utils/password.util'
import { USER_LIMITS, USER_NAME_PATTERN, USER_PHONE_PATTERN } from '../constants/user.constants'
import { cleanEmail, cleanFullName, cleanPhone } from '../utils/user.util'

const trimmed = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

export class CreateUserDto {
  @ApiProperty({ example: 'Asha Menon', minLength: USER_LIMITS.nameMin, maxLength: USER_LIMITS.nameMax })
  @Transform(({ value }) => (typeof value === 'string' ? cleanFullName(value) : value))
  @IsString()
  @MinLength(USER_LIMITS.nameMin, { message: `Name must be at least ${USER_LIMITS.nameMin} characters.` })
  @MaxLength(USER_LIMITS.nameMax, { message: `Name must be ${USER_LIMITS.nameMax} characters or fewer.` })
  @Matches(USER_NAME_PATTERN, { message: 'Name can use letters, spaces and . - / only.' })
  fullName: string

  @ApiProperty({ example: 'asha.menon@school.in', description: 'Used to sign in; must not already be in use' })
  @Transform(({ value }) => (typeof value === 'string' ? cleanEmail(value) : value))
  @IsEmail({}, { message: 'Enter a valid email address.' })
  @MaxLength(USER_LIMITS.emailMax)
  email: string

  @ApiPropertyOptional({ example: '+91 98765 43210' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? cleanPhone(value) : value))
  @IsString()
  @MaxLength(USER_LIMITS.phoneMax)
  @Matches(USER_PHONE_PATTERN, { message: 'Enter a phone number with at least 6 digits.' })
  phone?: string

  @ApiPropertyOptional({ example: 'Vice Principal', description: 'Shown next to the name' })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(USER_LIMITS.designationMax)
  designation?: string

  @ApiProperty({ format: 'uuid', description: 'The role this person gets' })
  @IsUUID('4', { message: 'Choose a role.' })
  roleId: string

  @ApiPropertyOptional({
    default: true,
    description: 'Emails an invitation link so the person chooses their own password.',
  })
  @IsOptional()
  @IsBoolean()
  sendInvitation?: boolean = true

  @ApiPropertyOptional({
    description:
      'Set a temporary password instead of emailing an invitation, for someone standing at the desk. ' +
      'They must change it at first sign-in.',
    minLength: PASSWORD_LIMITS.min,
    maxLength: PASSWORD_LIMITS.max,
  })
  @IsOptional()
  @IsString()
  @MinLength(PASSWORD_LIMITS.min, { message: `Use at least ${PASSWORD_LIMITS.min} characters.` })
  @MaxLength(PASSWORD_LIMITS.max)
  temporaryPassword?: string
}
