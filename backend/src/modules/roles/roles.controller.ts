import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdatePermissionsDto } from './dto/update-permissions.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RolesService } from './roles.service'
import { Role } from './schemas/role.schema'

@ApiTags('Roles & Permissions')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all roles',
    description: 'Returns all system-defined and institution-specific roles ordered by kind and title.',
  })
  @ApiOkResponse({
    description: 'List of all school staff roles',
    type: [Role],
  })
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get role by ID',
    description: 'Fetch details and assigned permissions for a specific role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique role identifier (UUID v4 or standard system key)',
    example: 'administrator',
  })
  @ApiOkResponse({
    description: 'Role details with granted permissions',
    type: Role,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create custom role',
    description: 'Provision a new school role, optionally copying permission settings from a template role.',
  })
  @ApiCreatedResponse({
    description: 'The newly created role',
    type: Role,
  })
  @ApiConflictResponse({
    description: 'A role with this name already exists',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed on supplied fields',
  })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update role details',
    description: 'Update the name or description of an existing role (system role names are immutable).',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique role identifier',
    example: 'transport-manager',
  })
  @ApiOkResponse({
    description: 'Updated role document',
    type: Role,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  @ApiConflictResponse({
    description: 'Another role with the target name already exists',
  })
  @ApiBadRequestResponse({
    description: 'System roles cannot be renamed or validation failed',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto)
  }

  @Put(':id/permissions')
  @ApiOperation({
    summary: 'Update assigned permissions',
    description: 'Save the complete list of granted permissions for a role (Administrator permissions are locked).',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique role identifier',
    example: 'teacher',
  })
  @ApiOkResponse({
    description: 'Role with updated permission set',
    type: Role,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  @ApiBadRequestResponse({
    description: 'Full-access administrator permissions cannot be modified',
  })
  async updatePermissions(
    @Param('id') id: string,
    @Body() updatePermissionsDto: UpdatePermissionsDto,
  ): Promise<Role> {
    return this.rolesService.updatePermissions(id, updatePermissionsDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete custom role',
    description: 'Permanently remove a custom role (built-in system roles cannot be deleted).',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique role identifier',
    example: 'transport-manager',
  })
  @ApiOkResponse({
    description: 'Deletion confirmation',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Role "Transport Manager" has been deleted.' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  @ApiBadRequestResponse({
    description: 'System roles cannot be deleted',
  })
  async remove(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    return this.rolesService.remove(id)
  }
}
