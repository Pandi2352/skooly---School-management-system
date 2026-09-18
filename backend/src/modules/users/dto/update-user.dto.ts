import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator'
import { USER_LIMITS, USER_NAME_PATTERN, USER_PHONE_PATTERN } from '../constants/user.constants'
import { cleanEmail, cleanFullName, cleanPhone } from '../utils/user.util'

/** Contact details only. Role and status have their own endpoints, so each change is deliberate. */
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Asha Menon' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? cleanFullName(value) : value))
  @IsString()
  @MinLength(USER_LIMITS.nameMin, { message: `Name must be at least ${USER_LIMITS.nameMin} characters.` })
  @MaxLength(USER_LIMITS.nameMax)
  @Matches(USER_NAME_PATTERN, { message: 'Name can use letters, spaces and . - / only.' })
  fullName?: string

  @ApiPropertyOptional({ example: 'asha.menon@school.in', description: 'Changing this changes how the person signs in' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? cleanEmail(value) : value))
  @IsEmail({}, { message: 'Enter a valid email address.' })
  @MaxLength(USER_LIMITS.emailMax)
  email?: string

  @ApiPropertyOptional({ example: '+91 98765 43210', description: 'Send an empty string to clear it' })
  @IsOptional()
  // An empty string clears the number, so the format check applies only when one is given.
  @ValidateIf((dto: UpdateUserDto) => dto.phone !== '')
  @Transform(({ value }) => (typeof value === 'string' ? cleanPhone(value) : value))
  @IsString()
  @MaxLength(USER_LIMITS.phoneMax)
  @Matches(USER_PHONE_PATTERN, { message: 'Enter a phone number with at least 6 digits.' })
  phone?: string

  @ApiPropertyOptional({ example: 'Vice Principal', description: 'Send an empty string to clear it' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(USER_LIMITS.designationMax)
  designation?: string
}
