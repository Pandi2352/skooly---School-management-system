import { ApiProperty } from '@nestjs/swagger'
import { ROLE_KINDS, type RoleKind } from '../constants/role.constants'

export class RoleResponseDto {
  @ApiProperty({ format: 'uuid', example: '6f1d2c3b-4a5e-4f60-9b7a-8c9d0e1f2a3b' })
  id: string

  @ApiProperty({ nullable: true, type: String, example: 'teacher', description: 'Set on system roles only' })
  code: string | null

  @ApiProperty({ example: 'Teacher' })
  name: string

  @ApiProperty({ example: 'Teaches classes: exams, homework, timetables and lesson plans.' })
  description: string

  @ApiProperty({ enum: ROLE_KINDS, example: 'system' })
  kind: RoleKind

  @ApiProperty({ example: false, description: 'Every permission, including pages added later' })
  fullAccess: boolean

  @ApiProperty({ type: [String], example: ['academic-management.online-exams:view'] })
  permissions: string[]

  @ApiProperty({ example: '2026-09-16T12:00:00.000Z' })
  createdAt: string

  @ApiProperty({ example: '2026-09-16T12:00:00.000Z' })
  updatedAt: string
}

export class RoleListMetaDto {
  @ApiProperty({ example: 6 })
  total: number

  @ApiProperty({ example: 5 })
  system: number

  @ApiProperty({ example: 1 })
  custom: number
}

export class DeletedRoleResponseDto {
  @ApiProperty({ format: 'uuid', example: '6f1d2c3b-4a5e-4f60-9b7a-8c9d0e1f2a3b' })
  id: string

  @ApiProperty({ example: 'Transport Manager' })
  name: string
}
