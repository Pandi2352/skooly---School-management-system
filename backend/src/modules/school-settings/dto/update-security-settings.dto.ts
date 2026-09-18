import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsIn, IsInt, Max, Min } from 'class-validator'
import {
  TWO_FACTOR_ENFORCEMENT_OPTIONS,
  type TwoFactorEnforcement,
} from '../constants/school-settings.constants'

export class UpdateSecuritySettingsDto {
  @ApiProperty({ description: 'Inactivity minutes before automatic logout (5 to 1440)', example: 30 })
  @IsInt()
  @Min(5)
  @Max(1440)
  sessionIdleMinutes: number

  @ApiProperty({ description: 'Allow extended session duration when remember me is selected', example: true })
  @IsBoolean()
  rememberMeEnabled: boolean

  @ApiProperty({ description: 'Duration in days for persistent sessions (1 to 90)', example: 30 })
  @IsInt()
  @Min(1)
  @Max(90)
  rememberMeDays: number

  @ApiProperty({ description: 'Maximum consecutive failed login attempts before lockout (3 to 20)', example: 5 })
  @IsInt()
  @Min(3)
  @Max(20)
  maxLoginAttempts: number

  @ApiProperty({ description: 'Lockout duration in minutes after exceeding attempts (1 to 1440)', example: 15 })
  @IsInt()
  @Min(1)
  @Max(1440)
  lockoutDurationMinutes: number

  @ApiProperty({ description: 'Minimum required password length (8 to 32)', example: 8 })
  @IsInt()
  @Min(8)
  @Max(32)
  passwordMinLength: number

  @ApiProperty({ description: 'Require at least one special character in passwords', example: true })
  @IsBoolean()
  requireSpecialChar: boolean

  @ApiProperty({ description: 'Require at least one numeric digit in passwords', example: true })
  @IsBoolean()
  requireNumber: boolean

  @ApiProperty({ description: 'Require at least one uppercase letter in passwords', example: true })
  @IsBoolean()
  requireUppercase: boolean

  @ApiProperty({
    description: 'Staff two-factor authentication enforcement policy',
    enum: TWO_FACTOR_ENFORCEMENT_OPTIONS,
    example: 'optional',
  })
  @IsIn(TWO_FACTOR_ENFORCEMENT_OPTIONS)
  twoFactorEnforcement: TwoFactorEnforcement
}
