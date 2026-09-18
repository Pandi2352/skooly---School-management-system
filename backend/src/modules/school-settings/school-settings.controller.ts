import { Body, Controller, Get, HttpStatus, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiErrors, ApiSuccess } from '../../common/decorators/api-envelope.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import {
  AttendanceSettingsResponseDto,
  IntegrationsSettingsResponseDto,
  SchoolProfileResponseDto,
  SchoolSettingsResponseDto,
  SecuritySettingsResponseDto,
  SystemSettingsResponseDto,
} from './dto/school-settings-response.dto'
import { UpdateAttendanceSettingsDto } from './dto/update-attendance-settings.dto'
import { UpdateIntegrationsSettingsDto } from './dto/update-integrations-settings.dto'
import { UpdateSchoolProfileDto } from './dto/update-school-profile.dto'
import { UpdateSecuritySettingsDto } from './dto/update-security-settings.dto'
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto'
import { SchoolSettingsService } from './school-settings.service'

@ApiTags('School Settings')
@Controller('settings/school')
export class SchoolSettingsController {
  constructor(private readonly service: SchoolSettingsService) {}

  @Get()
  @Public()
  @ResponseMessage('School settings fetched successfully.')
  @ApiOperation({ summary: 'Get entire school settings', description: 'Returns institutional profile, system, security, attendance, and integrations.' })
  @ApiSuccess(SchoolSettingsResponseDto, { description: 'Complete school settings' })
  @ApiErrors(HttpStatus.INTERNAL_SERVER_ERROR)
  getSettings(): Promise<SchoolSettingsResponseDto> {
    return this.service.getSettings()
  }

  @Get('profile')
  @Public()
  @ResponseMessage('School profile fetched successfully.')
  @ApiOperation({ summary: 'Get school profile', description: 'Returns institutional contact and identity information.' })
  @ApiSuccess(SchoolProfileResponseDto, { description: 'School profile information' })
  getProfile(): Promise<SchoolProfileResponseDto> {
    return this.service.getProfile()
  }

  @Put('profile')
  @Public()
  @ResponseMessage('School profile updated successfully.')
  @ApiOperation({ summary: 'Update school profile', description: 'Updates institutional name, address, contact and head of school.' })
  @ApiSuccess(SchoolProfileResponseDto, { description: 'Updated school profile' })
  @ApiErrors(HttpStatus.BAD_REQUEST)
  updateProfile(@Body() dto: UpdateSchoolProfileDto): Promise<SchoolProfileResponseDto> {
    return this.service.updateProfile(dto)
  }

  @Get('system')
  @Public()
  @ResponseMessage('System settings fetched successfully.')
  @ApiOperation({ summary: 'Get system formats and sequences', description: 'Returns currency, receipt templates, and numbering sequences.' })
  @ApiSuccess(SystemSettingsResponseDto, { description: 'System formatting and sequences' })
  getSystem(): Promise<SystemSettingsResponseDto> {
    return this.service.getSystem()
  }

  @Put('system')
  @Public()
  @ResponseMessage('System settings updated successfully.')
  @ApiOperation({ summary: 'Update system formats and sequences', description: 'Updates currency, receipt template, and numbering rules.' })
  @ApiSuccess(SystemSettingsResponseDto, { description: 'Updated system settings' })
  @ApiErrors(HttpStatus.BAD_REQUEST)
  updateSystem(@Body() dto: UpdateSystemSettingsDto): Promise<SystemSettingsResponseDto> {
    return this.service.updateSystem(dto)
  }

  @Get('security')
  @Public()
  @ResponseMessage('Security settings fetched successfully.')
  @ApiOperation({ summary: 'Get security settings', description: 'Returns session timeout, lockout threshold, password policy, and 2FA rules.' })
  @ApiSuccess(SecuritySettingsResponseDto, { description: 'Security settings' })
  getSecurity(): Promise<SecuritySettingsResponseDto> {
    return this.service.getSecurity()
  }

  @Put('security')
  @Public()
  @ResponseMessage('Security settings updated successfully.')
  @ApiOperation({ summary: 'Update security settings', description: 'Updates session idle minutes, remember me days, lockout threshold, and password policy.' })
  @ApiSuccess(SecuritySettingsResponseDto, { description: 'Updated security settings' })
  @ApiErrors(HttpStatus.BAD_REQUEST)
  updateSecurity(@Body() dto: UpdateSecuritySettingsDto): Promise<SecuritySettingsResponseDto> {
    return this.service.updateSecurity(dto)
  }

  @Get('attendance')
  @Public()
  @ResponseMessage('Attendance settings fetched successfully.')
  @ApiOperation({ summary: 'Get attendance settings', description: 'Returns tracking mode, working days, check-in cutoff, thresholds, and notifications.' })
  @ApiSuccess(AttendanceSettingsResponseDto, { description: 'Attendance settings' })
  getAttendance(): Promise<AttendanceSettingsResponseDto> {
    return this.service.getAttendance()
  }

  @Put('attendance')
  @Public()
  @ResponseMessage('Attendance settings updated successfully.')
  @ApiOperation({ summary: 'Update attendance settings', description: 'Updates tracking mode, schedule, check-in cutoff time, and notification rules.' })
  @ApiSuccess(AttendanceSettingsResponseDto, { description: 'Updated attendance settings' })
  @ApiErrors(HttpStatus.BAD_REQUEST)
  updateAttendance(@Body() dto: UpdateAttendanceSettingsDto): Promise<AttendanceSettingsResponseDto> {
    return this.service.updateAttendance(dto)
  }

  @Get('integrations')
  @Public()
  @ResponseMessage('Integrations settings fetched successfully.')
  @ApiOperation({ summary: 'Get external integrations', description: 'Returns configuration status for email SMTP, SMS gateway, and WhatsApp.' })
  @ApiSuccess(IntegrationsSettingsResponseDto, { description: 'Integrations settings' })
  getIntegrations(): Promise<IntegrationsSettingsResponseDto> {
    return this.service.getIntegrations()
  }

  @Put('integrations')
  @Public()
  @ResponseMessage('Integrations settings updated successfully.')
  @ApiOperation({ summary: 'Update external integrations', description: 'Updates email SMTP parameters, SMS gateway configuration, and WhatsApp settings.' })
  @ApiSuccess(IntegrationsSettingsResponseDto, { description: 'Updated integrations settings' })
  @ApiErrors(HttpStatus.BAD_REQUEST)
  updateIntegrations(@Body() dto: UpdateIntegrationsSettingsDto): Promise<IntegrationsSettingsResponseDto> {
    return this.service.updateIntegrations(dto)
  }
}
