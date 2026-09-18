import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { PASSWORD_LIMITS } from '../../../common/utils/password.util'
import { USER_LIMITS, USER_NAME_PATTERN } from '../../users/constants/user.constants'
import { cleanEmail, cleanFullName } from '../../users/utils/user.util'

const trimmed = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

export class LoginDto {
  @ApiProperty({ example: 'asha.menon@school.in' })
  @Transform(({ value }) => (typeof value === 'string' ? cleanEmail(value) : value))
  @IsEmail({}, { message: 'Enter the email address you sign in with.' })
  @MaxLength(USER_LIMITS.emailMax)
  email: string

  @ApiProperty({ description: 'Checked against the stored hash; never logged', example: 'correct horse battery' })
  @IsString()
  @MinLength(1, { message: 'Enter your password.' })
  @MaxLength(PASSWORD_LIMITS.max)
  password: string

  @ApiPropertyOptional({ default: false, description: 'Stays signed in on this device for longer' })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false
}

/** Creates the first administrator, and only while the school has no accounts at all. */
export class SetupDto {
  @ApiProperty({ example: 'Asha Menon' })
  @Transform(({ value }) => (typeof value === 'string' ? cleanFullName(value) : value))
  @IsString()
  @MinLength(USER_LIMITS.nameMin)
  @MaxLength(USER_LIMITS.nameMax)
  @Matches(USER_NAME_PATTERN, { message: 'Name can use letters, spaces and . - / only.' })
  fullName: string

  @ApiProperty({ example: 'asha.menon@school.in' })
  @Transform(({ value }) => (typeof value === 'string' ? cleanEmail(value) : value))
  @IsEmail({}, { message: 'Enter a valid email address.' })
  @MaxLength(USER_LIMITS.emailMax)
  email: string

  @ApiProperty({ minLength: PASSWORD_LIMITS.min, maxLength: PASSWORD_LIMITS.max })
  @IsString()
  @MinLength(PASSWORD_LIMITS.min, { message: `Use at least ${PASSWORD_LIMITS.min} characters.` })
  @MaxLength(PASSWORD_LIMITS.max)
  password: string

  @ApiPropertyOptional({ example: 'Principal', description: 'Shown next to the name' })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(USER_LIMITS.designationMax)
  designation?: string
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'The password being replaced' })
  @IsString()
  @MinLength(1, { message: 'Enter your current password.' })
  @MaxLength(PASSWORD_LIMITS.max)
  currentPassword: string

  @ApiProperty({ minLength: PASSWORD_LIMITS.min, maxLength: PASSWORD_LIMITS.max })
  @IsString()
  @MinLength(PASSWORD_LIMITS.min, { message: `Use at least ${PASSWORD_LIMITS.min} characters.` })
  @MaxLength(PASSWORD_LIMITS.max)
  newPassword: string
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'asha.menon@school.in' })
  @Transform(({ value }) => (typeof value === 'string' ? cleanEmail(value) : value))
  @IsEmail({}, { message: 'Enter the email address you sign in with.' })
  @MaxLength(USER_LIMITS.emailMax)
  email: string
}

/** Finishes an invitation or a password reset using the value from the emailed link. */
export class SetPasswordWithTokenDto {
  @ApiProperty({ description: 'The token from the link in the email' })
  @IsString()
  @MinLength(20, { message: 'This link isn’t complete. Copy the whole link from the email.' })
  @MaxLength(200)
  token: string

  @ApiProperty({ minLength: PASSWORD_LIMITS.min, maxLength: PASSWORD_LIMITS.max })
  @IsString()
  @MinLength(PASSWORD_LIMITS.min, { message: `Use at least ${PASSWORD_LIMITS.min} characters.` })
  @MaxLength(PASSWORD_LIMITS.max)
  password: string
}

export class CheckTokenDto {
  @ApiProperty({ description: 'The token from the link in the email' })
  @IsString()
  @MinLength(20, { message: 'This link isn’t complete. Copy the whole link from the email.' })
  @MaxLength(200)
  token: string
}
