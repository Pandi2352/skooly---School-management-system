import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ApiErrors, ApiSuccess } from '../../common/decorators/api-envelope.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe'
import { ResponseWithMeta } from '../../common/utils/response-with-meta.util'
import { AuditEventResponseDto } from '../audit/dto/audit-response.dto'
import { USER_PERMISSIONS } from './constants/user.constants'
import { ChangeUserRoleDto } from './dto/change-user-role.dto'
import { ChangeUserStatusDto } from './dto/change-user-status.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { ListUsersQueryDto } from './dto/list-users-query.dto'
import { SetTemporaryPasswordDto } from './dto/set-temporary-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import {
  CreatedUserResponseDto,
  InvitationSentResponseDto,
  SessionsEndedResponseDto,
  TemporaryPasswordResponseDto,
  UserListMetaDto,
  UserResponseDto,
  UserSessionResponseDto,
} from './dto/user-response.dto'
import { UsersService } from './users.service'

const USER_ID_PARAM = {
  name: 'id',
  format: 'uuid',
  description: 'Account id (UUID v4)',
  example: '6f1d2c3b-4a5e-4f60-9b7a-8c9d0e1f2a3b',
}

/** HTTP only: validation, status codes and messages. Every rule is in UsersService. */
@ApiTags('User Accounts')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions(USER_PERMISSIONS.view)
  @ResponseMessage('Accounts fetched successfully.')
  @ApiOperation({ summary: 'List accounts', description: 'Search, filter by status or role, and page through the results.' })
  @ApiSuccess(UserResponseDto, { description: 'Accounts, with counts per status in meta', isArray: true, meta: UserListMetaDto })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN)
  async list(@Query() query: ListUsersQueryDto): Promise<ResponseWithMeta<UserResponseDto[]>> {
    const { users, meta } = await this.usersService.list(query)
    return new ResponseWithMeta(users, { ...meta })
  }

  @Get(':id')
  @RequirePermissions(USER_PERMISSIONS.view)
  @ResponseMessage('Account fetched successfully.')
  @ApiOperation({ summary: 'Get an account' })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(UserResponseDto, { description: 'The account and its role' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND)
  findOne(@Param('id', UuidParamPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id)
  }

  @Post()
  @RequirePermissions(USER_PERMISSIONS.create)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Account created successfully.')
  @ApiOperation({
    summary: 'Add an account',
    description:
      'Emails an invitation so the person chooses their own password. Send temporaryPassword instead for someone at the desk.',
  })
  @ApiSuccess(CreatedUserResponseDto, { status: HttpStatus.CREATED, description: 'The new account and how to hand it over' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.CONFLICT,
  )
  create(@Body() dto: CreateUserDto, @CurrentUser() actor?: AuthenticatedUserContext): Promise<CreatedUserResponseDto> {
    return this.usersService.create(dto, actor)
  }

  @Patch(':id')
  @RequirePermissions(USER_PERMISSIONS.edit)
  @ResponseMessage('Account updated successfully.')
  @ApiOperation({ summary: 'Update contact details', description: 'Name, email, phone and designation. Role and status have their own endpoints.' })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(UserResponseDto, { description: 'The updated account' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.CONFLICT,
  )
  update(
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto, actor)
  }

  @Put(':id/role')
  @RequirePermissions(USER_PERMISSIONS.edit)
  @ResponseMessage('Role changed successfully.')
  @ApiOperation({
    summary: 'Change the role',
    description: 'Takes effect on the next request. The last active administrator can’t be moved off an administrator role.',
  })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(UserResponseDto, { description: 'The account with its new role' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  changeRole(
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: ChangeUserRoleDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<UserResponseDto> {
    return this.usersService.changeRole(id, dto, actor)
  }

  @Put(':id/status')
  @RequirePermissions(USER_PERMISSIONS.edit)
  @ResponseMessage('Account status changed successfully.')
  @ApiOperation({
    summary: 'Suspend an account or switch it back on',
    description: 'Suspending ends that person’s sessions straight away. Archiving has its own endpoint.',
  })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(UserResponseDto, { description: 'The account in its new state' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  changeStatus(
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: ChangeUserStatusDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<UserResponseDto> {
    return this.usersService.changeStatus(id, dto, actor)
  }

  @Post(':id/invitation')
  @ResponseMessage('Invitation sent successfully.')
  @RequirePermissions(USER_PERMISSIONS.edit)
  @ApiOperation({ summary: 'Send the invitation again', description: 'Only for an account that hasn’t set a password yet. Earlier links stop working.' })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(InvitationSentResponseDto, { description: 'Whether the email went out, and the link if it didn’t' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  resendInvitation(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<InvitationSentResponseDto> {
    return this.usersService.resendInvitation(id, actor)
  }

  @Post(':id/password-reset')
  @ResponseMessage('Password reset link sent successfully.')
  @RequirePermissions(USER_PERMISSIONS.edit)
  @ApiOperation({ summary: 'Email a password reset link', description: 'For someone who can’t sign in. The link can be used once.' })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(InvitationSentResponseDto, { description: 'Whether the email went out, and the link if it didn’t' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  sendPasswordReset(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<InvitationSentResponseDto> {
    return this.usersService.sendPasswordReset(id, actor)
  }

  @Post(':id/temporary-password')
  @ResponseMessage('Temporary password set successfully.')
  @RequirePermissions(USER_PERMISSIONS.edit)
  @ApiOperation({
    summary: 'Set a temporary password',
    description: 'For a colleague at the desk or when email is down. It is returned once, and they must change it at sign-in.',
  })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(TemporaryPasswordResponseDto, { description: 'The password to read out, and how many sessions ended' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  setTemporaryPassword(
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: SetTemporaryPasswordDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<TemporaryPasswordResponseDto> {
    return this.usersService.setTemporaryPassword(id, dto, actor)
  }

  @Delete(':id')
  @RequirePermissions(USER_PERMISSIONS.delete)
  @ResponseMessage('Account archived successfully.')
  @ApiOperation({
    summary: 'Archive an account',
    description:
      'The account stops signing in and keeps everything it created, so old records still say who made them. ' +
      'It can be switched back on from the status endpoint.',
  })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(UserResponseDto, { description: 'The archived account' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  archive(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<UserResponseDto> {
    return this.usersService.archive(id, actor)
  }

  @Get(':id/audit')
  @RequirePermissions(USER_PERMISSIONS.view)
  @ResponseMessage('Account history fetched successfully.')
  @ApiOperation({
    summary: 'What has happened to this account',
    description: 'Recent sign-ins, lockouts and changes made by administrators, newest first.',
  })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(AuditEventResponseDto, { description: 'Recent events for this account', isArray: true })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND)
  listAuditEvents(@Param('id', UuidParamPipe) id: string): Promise<AuditEventResponseDto[]> {
    return this.usersService.listAuditEvents(id)
  }

  @Get(':id/sessions')
  @RequirePermissions(USER_PERMISSIONS.view)
  @ResponseMessage('Sessions fetched successfully.')
  @ApiOperation({ summary: 'Where this account is signed in' })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(UserSessionResponseDto, { description: 'Live sessions, most recently used first', isArray: true })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND)
  listSessions(@Param('id', UuidParamPipe) id: string): Promise<UserSessionResponseDto[]> {
    return this.usersService.listSessions(id)
  }

  @Delete(':id/sessions')
  @RequirePermissions(USER_PERMISSIONS.edit)
  @ResponseMessage('Sessions ended successfully.')
  @ApiOperation({ summary: 'Sign this account out everywhere', description: 'The password still works; only the signed-in devices are ended.' })
  @ApiParam(USER_ID_PARAM)
  @ApiSuccess(SessionsEndedResponseDto, { description: 'How many sessions were ended' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND)
  revokeSessions(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<SessionsEndedResponseDto> {
    return this.usersService.revokeSessions(id, actor)
  }
}
