import { PartialType, PickType } from '@nestjs/swagger'
import { CreateRoleDto } from './create-role.dto'

/**
 * Name and/or description, with the same rules as creating a role; at least one is required
 * (checked in the service). System roles accept a description change only.
 */
export class UpdateRoleDto extends PartialType(PickType(CreateRoleDto, ['name', 'description'] as const)) {}
