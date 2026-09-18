import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ChangeUserRoleDto {
  @ApiProperty({ format: 'uuid', description: 'The role to move this account to' })
  @IsUUID('4', { message: 'Choose a role.' })
  roleId: string
}
