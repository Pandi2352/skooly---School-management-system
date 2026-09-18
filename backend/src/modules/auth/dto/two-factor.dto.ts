import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { PASSWORD_LIMITS } from '../../../common/utils/password.util'

export class TwoFactorSetupDto {
  @ApiProperty({
    description: 'The seed in text, for typing into an app that can’t scan',
    example: 'JBSWY3DPEHPK3PXP',
  })
  secret: string

  @ApiProperty({
    description: 'The same seed as an otpauth:// link, which is what the QR code contains',
    example: 'otpauth://totp/Skooly:asha@school.in?secret=...',
  })
  otpauthUrl: string

  @ApiProperty({ description: 'The QR code as a data URL, ready to put in an <img>' })
  qrCodeDataUrl: string
}

/** A code from the authenticator app, or a recovery code; spaces and dashes are forgiven. */
export class TwoFactorCodeDto {
  @ApiProperty({ example: '123456', description: 'Six digits from the app, or a recovery code' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(6, { message: 'Enter the six-digit code from your app.' })
  @MaxLength(20)
  code: string
}

export class TwoFactorSignInDto extends TwoFactorCodeDto {
  @ApiProperty({ description: 'The handle returned by /auth/login when a code is needed' })
  @IsString()
  @MinLength(20, { message: 'This sign-in is no longer open. Start again with your email and password.' })
  @MaxLength(200)
  challengeToken: string
}

/** Switching two-step sign-in off asks for the password: a borrowed screen shouldn't be enough. */
export class TwoFactorDisableDto {
  @ApiProperty({ description: 'The account’s current password' })
  @IsString()
  @MinLength(1, { message: 'Enter your password.' })
  @MaxLength(PASSWORD_LIMITS.max)
  password: string
}

export class TwoFactorStatusDto {
  @ApiProperty({ example: true, description: 'False when the server has no TWO_FACTOR_KEY set' })
  available: boolean

  @ApiProperty({ example: false })
  enabled: boolean

  @ApiPropertyOptional({ example: '2026-09-18T07:30:00.000Z', nullable: true })
  confirmedAt: string | null

  @ApiProperty({ example: 10, description: 'Unused recovery codes left' })
  recoveryCodesLeft: number
}

export class RecoveryCodesDto {
  @ApiProperty({
    type: [String],
    description: 'Shown once. Only their hashes are stored, so they can’t be shown again.',
    example: ['ABCD-2345', 'EFGH-6789'],
  })
  recoveryCodes: string[]
}
