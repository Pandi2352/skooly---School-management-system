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
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ApiErrors, ApiSuccess } from '../../common/decorators/api-envelope.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import { PermissionsGuard } from '../../common/guards/permissions.guard'
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe'
import { ResponseWithMeta } from '../../common/utils/response-with-meta.util'
import { CreateRoleDto } from './dto/create-role.dto'
import { ListRolesQueryDto } from './dto/list-roles-query.dto'
import { DeletedRoleResponseDto, RoleListMetaDto, RoleResponseDto } from './dto/role-response.dto'
import { UpdatePermissionsDto } from './dto/update-permissions.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RolesService } from './roles.service'

const ROLE_ID_PARAM = {
  name: 'id',
  format: 'uuid',
  description: 'Role id (UUID v4)',
  example: '6f1d2c3b-4a5e-4f60-9b7a-8c9d0e1f2a3b',
}

/** HTTP only: validation, status codes and messages. Every rule is in RolesService. */
@ApiTags('Roles & Permissions')
@UseGuards(PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions('roles:view')
  @ResponseMessage('Roles fetched successfully.')
  @ApiOperation({ summary: 'List roles', description: 'Administrator first, then system roles, then custom roles, each A–Z.' })
  @ApiSuccess(RoleResponseDto, { description: 'Roles with counts in meta', isArray: true, meta: RoleListMetaDto })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.FORBIDDEN, HttpStatus.INTERNAL_SERVER_ERROR)
  async findAll(@Query() query: ListRolesQueryDto): Promise<ResponseWithMeta<RoleResponseDto[]>> {
    const { roles, meta } = await this.rolesService.findAll(query)
    return new ResponseWithMeta(roles, { ...meta })
  }

  @Get(':id')
  @RequirePermissions('roles:view')
  @ResponseMessage('Role fetched successfully.')
  @ApiOperation({ summary: 'Get a role' })
  @ApiParam(ROLE_ID_PARAM)
  @ApiSuccess(RoleResponseDto, { description: 'The role and its permissions' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND)
  findOne(@Param('id', UuidParamPipe) id: string): Promise<RoleResponseDto> {
    return this.rolesService.findOne(id)
  }

  @Post()
  @RequirePermissions('roles:create')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Role created successfully.')
  @ApiOperation({ summary: 'Create a custom role', description: 'Optionally copies permissions from another role.' })
  @ApiSuccess(RoleResponseDto, { status: HttpStatus.CREATED, description: 'The new role' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND, HttpStatus.CONFLICT, HttpStatus.UNPROCESSABLE_ENTITY)
  create(@Body() dto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.create(dto)
  }

  @Patch(':id')
  @RequirePermissions('roles:edit')
  @ResponseMessage('Role updated successfully.')
  @ApiOperation({ summary: 'Update role details', description: 'Name and/or description. System roles can’t be renamed.' })
  @ApiParam(ROLE_ID_PARAM)
  @ApiSuccess(RoleResponseDto, { description: 'The updated role' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND, HttpStatus.CONFLICT, HttpStatus.UNPROCESSABLE_ENTITY)
  update(@Param('id', UuidParamPipe) id: string, @Body() dto: UpdateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.update(id, dto)
  }

  @Put(':id/permissions')
  @RequirePermissions('roles:edit')
  @ResponseMessage('Role permissions saved successfully.')
  @ApiOperation({
    summary: 'Replace role permissions',
    description: 'Saves the complete list; duplicates are removed. Full-access roles are locked.',
  })
  @ApiParam(ROLE_ID_PARAM)
  @ApiSuccess(RoleResponseDto, { description: 'The role with its new permissions' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND, HttpStatus.UNPROCESSABLE_ENTITY)
  updatePermissions(@Param('id', UuidParamPipe) id: string, @Body() dto: UpdatePermissionsDto): Promise<RoleResponseDto> {
    return this.rolesService.updatePermissions(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('roles:delete')
  @ResponseMessage('Role deleted successfully.')
  @ApiOperation({ summary: 'Delete a custom role', description: 'System roles can’t be deleted.' })
  @ApiParam(ROLE_ID_PARAM)
  @ApiSuccess(DeletedRoleResponseDto, { description: 'The deleted role’s id and name' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND, HttpStatus.UNPROCESSABLE_ENTITY)
  remove(@Param('id', UuidParamPipe) id: string): Promise<DeletedRoleResponseDto> {
    return this.rolesService.remove(id)
  }
}

