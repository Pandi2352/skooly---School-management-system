import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'
import { ApiErrors, ApiSuccess } from '../../common/decorators/api-envelope.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe'
import type { AppEnvConfig, AuthEnvConfig } from '../../config/env.config'
import { UserSessionResponseDto } from '../users/dto/user-response.dto'
import { clearSessionCookie, setSessionCookie } from './auth.cookie'
import { AuthService, type SignInContext, type SignInResult } from './auth.service'
import {
  ChangePasswordDto,
  CheckTokenDto,
  ForgotPasswordDto,
  LoginDto,
  SetPasswordWithTokenDto,
  SetupDto,
} from './dto/auth-request.dto'
import {
  MessageResponseDto,
  PasswordChangedResponseDto,
  SetupStateDto,
  SignedInUserDto,
  TokenCheckDto,
} from './dto/auth-response.dto'
import { AUTH_RATE_LIMIT } from './constants/auth.constants'
import { SessionRequiredGuard } from './guards/session-required.guard'

/**
 * Signing in and everything about one's own account. The session cookie is set here and nowhere
 * else, so every route that starts a session goes through `sendSession`.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('setup-state')
  @Public()
  @ResponseMessage('Setup state fetched successfully.')
  @ApiOperation({ summary: 'Does this school still need its first account?', description: 'The web app asks this before showing the sign-in page.' })
  @ApiSuccess(SetupStateDto, { description: 'Whether the first administrator still has to be created' })
  @ApiErrors(HttpStatus.INTERNAL_SERVER_ERROR)
  getSetupState(): Promise<SetupStateDto> {
    return this.authService.getSetupState()
  }

  @Post('setup')
  @Throttle({ default: { limit: AUTH_RATE_LIMIT.limit, ttl: AUTH_RATE_LIMIT.ttlSeconds * 1000 } })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Your administrator account is ready.')
  @ApiOperation({
    summary: 'Create the first administrator',
    description: 'Works only while the school has no accounts at all. The new administrator is signed in straight away.',
  })
  @ApiSuccess(SignedInUserDto, { status: HttpStatus.CREATED, description: 'The new administrator, signed in' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.CONFLICT, HttpStatus.SERVICE_UNAVAILABLE)
  async setup(
    @Body() dto: SetupDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignedInUserDto> {
    return this.sendSession(await this.authService.setup(dto, this.contextOf(request)), response)
  }

  @Post('login')
  @Throttle({ default: { limit: AUTH_RATE_LIMIT.limit, ttl: AUTH_RATE_LIMIT.ttlSeconds * 1000 } })
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Signed in successfully.')
  @ApiOperation({
    summary: 'Sign in',
    description:
      'Sets an httpOnly session cookie. An unknown email and a wrong password give the same answer, and repeated wrong passwords lock the account for a while.',
  })
  @ApiSuccess(SignedInUserDto, { description: 'Who signed in, and what they may do' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.TOO_MANY_REQUESTS)
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignedInUserDto> {
    return this.sendSession(await this.authService.login(dto, this.contextOf(request)), response)
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Signed out successfully.')
  @ApiOperation({ summary: 'Sign out', description: 'Ends this session and clears the cookie. Safe to call when already signed out.' })
  @ApiSuccess(MessageResponseDto, { description: 'Signed out' })
  async logout(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<MessageResponseDto> {
    if (actor) await this.authService.logout(actor)
    clearSessionCookie(response, this.appConfig, this.authConfig)
    return { message: 'You are signed out.' }
  }

  @Get('me')
  @UseGuards(SessionRequiredGuard)
  @ResponseMessage('Account fetched successfully.')
  @ApiOperation({
    summary: 'Who am I?',
    description: 'Read fresh each time, so a role change or a suspension shows up on the next request.',
  })
  @ApiSuccess(SignedInUserDto, { description: 'The signed-in person, their role and their permissions' })
  @ApiErrors(HttpStatus.UNAUTHORIZED)
  getCurrentAccount(@CurrentUser() actor: AuthenticatedUserContext): Promise<SignedInUserDto> {
    return this.authService.getCurrentAccount(actor)
  }

  @Post('change-password')
  @UseGuards(SessionRequiredGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password changed successfully.')
  @ApiOperation({ summary: 'Change my password', description: 'Your other devices are signed out; this one stays signed in.' })
  @ApiSuccess(PasswordChangedResponseDto, { description: 'How many other sessions ended' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED)
  changePassword(
    @CurrentUser() actor: AuthenticatedUserContext,
    @Body() dto: ChangePasswordDto,
  ): Promise<PasswordChangedResponseDto> {
    return this.authService.changePassword(actor, dto)
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: AUTH_RATE_LIMIT.limit, ttl: AUTH_RATE_LIMIT.ttlSeconds * 1000 } })
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Request received.')
  @ApiOperation({
    summary: 'Ask for a password reset link',
    description: 'Always answers the same way, whether or not that email has an account.',
  })
  @ApiSuccess(MessageResponseDto, { description: 'The same answer for every email address' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.TOO_MANY_REQUESTS)
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<MessageResponseDto> {
    await this.authService.forgotPassword(dto)
    return { message: 'If that email address has an account, a reset link is on its way. It works for a short time only.' }
  }

  @Post('check-token')
  @Throttle({ default: { limit: AUTH_RATE_LIMIT.limit, ttl: AUTH_RATE_LIMIT.ttlSeconds * 1000 } })
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Link checked successfully.')
  @ApiOperation({
    summary: 'Check a link from an email',
    description: 'Used before showing the password form, so an expired or used link is caught first.',
  })
  @ApiSuccess(TokenCheckDto, { description: 'What the link is for and whose account it belongs to' })
  @ApiErrors(HttpStatus.BAD_REQUEST)
  checkToken(@Body() dto: CheckTokenDto): Promise<TokenCheckDto> {
    return this.authService.checkToken(dto.token)
  }

  @Post('set-password')
  @Throttle({ default: { limit: AUTH_RATE_LIMIT.limit, ttl: AUTH_RATE_LIMIT.ttlSeconds * 1000 } })
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password set successfully.')
  @ApiOperation({
    summary: 'Set a password from an invitation or reset link',
    description: 'The link can be used once. Any session that account already had is ended, and this browser is signed in.',
  })
  @ApiSuccess(SignedInUserDto, { description: 'The account, now signed in' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.TOO_MANY_REQUESTS)
  async setPassword(
    @Body() dto: SetPasswordWithTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignedInUserDto> {
    return this.sendSession(await this.authService.setPasswordWithToken(dto, this.contextOf(request)), response)
  }

  @Get('sessions')
  @UseGuards(SessionRequiredGuard)
  @ResponseMessage('Sessions fetched successfully.')
  @ApiOperation({ summary: 'Where am I signed in?' })
  @ApiSuccess(UserSessionResponseDto, { description: 'This person’s live sessions, this one marked', isArray: true })
  @ApiErrors(HttpStatus.UNAUTHORIZED)
  listOwnSessions(@CurrentUser() actor: AuthenticatedUserContext): Promise<UserSessionResponseDto[]> {
    return this.authService.listOwnSessions(actor)
  }

  @Delete('sessions/:id')
  @UseGuards(SessionRequiredGuard)
  @ResponseMessage('Session ended successfully.')
  @ApiOperation({ summary: 'Sign out one of my devices' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Session id (UUID v4)' })
  @ApiSuccess(MessageResponseDto, { description: 'That session has ended' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.NOT_FOUND)
  async revokeOwnSession(
    @CurrentUser() actor: AuthenticatedUserContext,
    @Param('id', UuidParamPipe) id: string,
  ): Promise<MessageResponseDto> {
    await this.authService.revokeOwnSession(actor, id)
    return { message: 'That device has been signed out.' }
  }

  @Delete('sessions')
  @UseGuards(SessionRequiredGuard)
  @ResponseMessage('Other sessions ended successfully.')
  @ApiOperation({ summary: 'Sign out my other devices', description: 'This device stays signed in.' })
  @ApiSuccess(MessageResponseDto, { description: 'How many devices were signed out' })
  @ApiErrors(HttpStatus.UNAUTHORIZED)
  async revokeOtherSessions(@CurrentUser() actor: AuthenticatedUserContext): Promise<MessageResponseDto> {
    const ended = await this.authService.revokeOtherSessions(actor)
    return { message: ended === 1 ? '1 other device was signed out.' : `${ended} other devices were signed out.` }
  }

  private get appConfig(): AppEnvConfig {
    return this.configService.getOrThrow<AppEnvConfig>('app')
  }

  private get authConfig(): AuthEnvConfig {
    return this.configService.getOrThrow<AuthEnvConfig>('auth')
  }

  /** Puts the new session in the cookie and returns only the part the web app may see. */
  private sendSession(result: SignInResult, response: Response): SignedInUserDto {
    setSessionCookie(response, result.session.token, result.session.expiresAt, this.appConfig, this.authConfig)
    return result.account
  }

  private contextOf(request: Request): SignInContext {
    return {
      userAgent: request.get('user-agent') ?? '',
      // Behind a proxy this is the proxy's address unless Express is set to trust it.
      ip: request.ip ?? '',
    }
  }
}
