import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { USER_STATUSES, type UserStatus } from '../constants/user.constants'

/** The role shown with an account. The full role, with its permissions, comes from the roles API. */
export class UserRoleSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string

  @ApiProperty({ example: 'Accountant' })
  name: string

  @ApiProperty({ example: false, description: 'This role has every permission' })
  fullAccess: boolean
}

export class UserResponseDto {
  @ApiProperty({ format: 'uuid', example: '6f1d2c3b-4a5e-4f60-9b7a-8c9d0e1f2a3b' })
  id: string

  @ApiProperty({ example: 'Asha Menon' })
  fullName: string

  @ApiProperty({ example: 'asha.menon@school.in' })
  email: string

  @ApiProperty({ example: '+91 98765 43210' })
  phone: string

  @ApiProperty({ example: 'Vice Principal' })
  designation: string

  @ApiProperty({ type: UserRoleSummaryDto, nullable: true, description: 'Null only if the role was removed' })
  role: UserRoleSummaryDto | null

  @ApiProperty({ enum: USER_STATUSES, example: 'active' })
  status: UserStatus

  @ApiProperty({ example: false, description: 'Signs in, then has to choose a new password' })
  mustChangePassword: boolean

  @ApiProperty({ example: false, description: 'Sign-in is blocked right now after too many wrong passwords' })
  isLocked: boolean

  @ApiProperty({ nullable: true, type: String, example: '2026-09-18T07:30:00.000Z' })
  lockedUntil: string | null

  @ApiProperty({ nullable: true, type: String, example: '2026-09-17T09:12:00.000Z' })
  lastLoginAt: string | null

  @ApiProperty({ nullable: true, type: String, description: 'When the invitation was last emailed' })
  invitedAt: string | null

  @ApiProperty({ nullable: true, type: String, description: 'When the first password was set' })
  activatedAt: string | null

  @ApiProperty({ example: '2026-09-16T12:00:00.000Z' })
  createdAt: string

  @ApiProperty({ example: '2026-09-16T12:00:00.000Z' })
  updatedAt: string
}

/** What the administrator needs right after adding someone. */
export class CreatedUserResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto

  @ApiProperty({ example: true, description: 'False when email is off or the mail server refused it' })
  invitationEmailSent: boolean

  @ApiPropertyOptional({
    description: 'The invitation link, returned only when the email could not be sent so it can be shared another way',
    example: 'https://school.example/set-password?token=...',
  })
  invitationLink?: string

  @ApiPropertyOptional({
    description: 'A temporary password to read out, returned only when one was set instead of emailing an invitation',
    example: 'Kp7ru9Mxab34',
  })
  temporaryPassword?: string
}

export class TemporaryPasswordResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto

  @ApiProperty({ example: 'Kp7ru9Mxab34', description: 'Share it with the person; it is shown once and not stored in readable form' })
  temporaryPassword: string

  @ApiProperty({ example: 2, description: 'Sessions that were signed out by this change' })
  sessionsEnded: number
}

export class InvitationSentResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto

  @ApiProperty({ example: true })
  emailSent: boolean

  @ApiPropertyOptional({ description: 'Returned only when the email could not be sent' })
  link?: string

  @ApiProperty({ example: '2026-09-21T07:30:00.000Z', description: 'When the link stops working' })
  expiresAt: string
}

export class UserListMetaDto {
  @ApiProperty({ example: 42, description: 'Accounts matching the current filters' })
  total: number

  @ApiProperty({ example: 1 })
  page: number

  @ApiProperty({ example: 20 })
  limit: number

  @ApiProperty({ example: 3 })
  totalPages: number

  @ApiProperty({ example: 38, description: 'Active accounts in the school, ignoring the filters' })
  active: number

  @ApiProperty({ example: 2 })
  invited: number

  @ApiProperty({ example: 1 })
  suspended: number

  @ApiProperty({ example: 1 })
  archived: number

  @ApiProperty({ example: 2, description: 'Accounts with a full-access role' })
  administrators: number
}

export class UserSessionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string

  @ApiProperty({ example: 'Chrome on Windows' })
  device: string

  @ApiProperty({ example: '203.0.113.7' })
  ip: string

  @ApiProperty({ example: '2026-09-18T07:30:00.000Z' })
  lastSeenAt: string

  @ApiProperty({ example: '2026-09-18T06:00:00.000Z' })
  signedInAt: string

  @ApiProperty({ example: '2026-09-18T19:30:00.000Z', description: 'Signed out after this without use' })
  expiresAt: string

  @ApiProperty({ example: false, description: 'True for the session making this request' })
  isCurrent: boolean
}

export class SessionsEndedResponseDto {
  @ApiProperty({ example: 3 })
  sessionsEnded: number
}
