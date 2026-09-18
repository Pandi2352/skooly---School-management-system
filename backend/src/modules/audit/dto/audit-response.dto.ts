import { ApiProperty } from '@nestjs/swagger'
import { AUDIT_ACTIONS, type AuditAction } from '../audit.constants'

export class AuditEventResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string

  @ApiProperty({ enum: AUDIT_ACTIONS, example: 'user.role_changed' })
  action: AuditAction

  @ApiProperty({ description: 'The action in plain words', example: 'Role changed' })
  label: string

  @ApiProperty({ description: 'Who did it, as they were named at the time', example: 'Asha Menon' })
  actorName: string

  @ApiProperty({ description: 'Whose account it was', example: 'Ravi Kumar' })
  targetName: string

  @ApiProperty({ description: 'What changed', example: 'Teacher to Accountant' })
  summary: string

  @ApiProperty({ example: '203.0.113.7' })
  ip: string

  @ApiProperty({ example: '2026-09-18T07:30:00.000Z' })
  at: string
}
