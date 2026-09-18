import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { TOKEN_PURPOSES, type TokenPurpose } from '../constants/auth.constants'
import { UserResponseDto } from '../../users/dto/user-response.dto'

/** Everything the web app needs after signing in: who you are and what you may do. */
export class SignedInUserDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto

  @ApiProperty({
    type: [String],
    description: 'Permission keys this person has. Empty for a full-access role, where fullAccess is true instead.',
    example: ['student-information.student-list:view'],
  })
  permissions: string[]

  @ApiProperty({ example: false, description: 'This role has every permission, including pages added later' })
  fullAccess: boolean

  @ApiProperty({ example: false, description: 'They must choose a new password before doing anything else' })
  mustChangePassword: boolean

  @ApiProperty({ example: '2026-09-18T19:30:00.000Z', description: 'When this session ends if unused' })
  sessionExpiresAt: string
}

export class SetupStateDto {
  @ApiProperty({ example: false, description: 'True when the school has no accounts yet, so the first one can be created' })
  needsSetup: boolean
}

/** Answer for a link from an email, before the person types a password. */
export class TokenCheckDto {
  @ApiProperty({ enum: TOKEN_PURPOSES, example: 'invitation' })
  purpose: TokenPurpose

  @ApiProperty({ example: 'Asha Menon' })
  fullName: string

  @ApiProperty({ example: 'asha.menon@school.in', description: 'Shown so the person knows which account they are setting up' })
  email: string

  @ApiProperty({ example: '2026-09-21T07:30:00.000Z' })
  expiresAt: string
}

export class MessageResponseDto {
  @ApiProperty({ example: 'If that email has an account, a reset link is on its way.' })
  message: string
}

export class PasswordChangedResponseDto {
  @ApiProperty({ example: 2, description: 'Other devices that were signed out by the change' })
  otherSessionsEnded: number

  @ApiPropertyOptional({ example: true, description: 'Whether the "your password changed" email went out' })
  emailSent?: boolean
}
