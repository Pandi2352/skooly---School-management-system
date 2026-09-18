import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { PASSWORD_LIMITS } from '../../../common/utils/password.util'

/**
 * For a colleague standing at the desk, or when email is not working. Leave the password out and
 * one is generated to read out. Either way the person must change it at their next sign-in.
 */
export class SetTemporaryPasswordDto {
  @ApiPropertyOptional({
    description: 'A password you choose. Leave it out to have one generated.',
    minLength: PASSWORD_LIMITS.min,
    maxLength: PASSWORD_LIMITS.max,
  })
  @IsOptional()
  @IsString()
  @MinLength(PASSWORD_LIMITS.min, { message: `Use at least ${PASSWORD_LIMITS.min} characters.` })
  @MaxLength(PASSWORD_LIMITS.max)
  password?: string
}
