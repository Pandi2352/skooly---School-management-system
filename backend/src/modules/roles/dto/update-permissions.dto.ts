import { ApiProperty } from '@nestjs/swagger'
import { ArrayMaxSize, IsArray, IsString, Matches } from 'class-validator'
import { PERMISSION_KEY_PATTERN, ROLE_LIMITS } from '../constants/role.constants'

/** The complete permission list for a role; it replaces the saved list. Duplicates are removed. */
export class UpdatePermissionsDto {
  @ApiProperty({
    type: [String],
    example: ['fees-and-finance.fee-collection:view', 'fees-and-finance.fee-collection:edit', 'backup-management:view'],
    description: 'Keys shaped "<module>.<page>:<action>" or "<module>:<action>"; action is view, create, edit or delete',
    maxItems: ROLE_LIMITS.permissionsMax,
  })
  @IsArray({ message: 'permissions must be a list.' })
  @ArrayMaxSize(ROLE_LIMITS.permissionsMax, {
    message: `A role can have at most ${ROLE_LIMITS.permissionsMax} permissions.`,
  })
  @IsString({ each: true, message: 'Each permission must be text.' })
  @Matches(PERMISSION_KEY_PATTERN, {
    each: true,
    message: 'Each permission must look like "module.page:view" (actions: view, create, edit, delete).',
  })
  permissions: string[]
}
