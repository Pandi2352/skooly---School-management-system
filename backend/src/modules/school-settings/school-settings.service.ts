import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import {
  DEFAULT_ATTENDANCE_SETTINGS,
  DEFAULT_INTEGRATIONS_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
} from './constants/school-settings.constants'
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
import { SchoolSettingsDocument } from './schemas/school-settings.schema'
import { SchoolSettingsRepository } from './school-settings.repository'

@Injectable()
export class SchoolSettingsService implements OnModuleInit {
  private readonly logger = new Logger(SchoolSettingsService.name)

  constructor(private readonly repository: SchoolSettingsRepository) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.repository.ensureExists()
    } catch (error) {
      this.logger.error('Could not initialize default school settings', error instanceof Error ? error.stack : String(error))
    }
  }

  async getSettings(): Promise<SchoolSettingsResponseDto> {
    const record = await this.getRecord()
    return this.toResponse(record)
  }

  async getProfile(): Promise<SchoolProfileResponseDto> {
    const record = await this.getRecord()
    return record.profile
  }

  async updateProfile(dto: UpdateSchoolProfileDto): Promise<SchoolProfileResponseDto> {
    await this.getRecord()
    const updated = await this.repository.updateProfile(dto)
    return (updated ?? (await this.getRecord())).profile
  }

  async getSystem(): Promise<SystemSettingsResponseDto> {
    const record = await this.getRecord()
    return record.system
  }

  async updateSystem(dto: UpdateSystemSettingsDto): Promise<SystemSettingsResponseDto> {
    await this.getRecord()
    const updated = await this.repository.updateSystem(dto)
    return (updated ?? (await this.getRecord())).system
  }

  async getSecurity(): Promise<SecuritySettingsResponseDto> {
    const record = await this.getRecord()
    return (record.security ?? DEFAULT_SECURITY_SETTINGS) as SecuritySettingsResponseDto
  }

  async updateSecurity(dto: UpdateSecuritySettingsDto): Promise<SecuritySettingsResponseDto> {
    await this.getRecord()
    const updated = await this.repository.updateSecurity(dto)
    return ((updated ?? (await this.getRecord())).security ?? DEFAULT_SECURITY_SETTINGS) as SecuritySettingsResponseDto
  }

  async getAttendance(): Promise<AttendanceSettingsResponseDto> {
    const record = await this.getRecord()
    return (record.attendance ?? DEFAULT_ATTENDANCE_SETTINGS) as AttendanceSettingsResponseDto
  }

  async updateAttendance(dto: UpdateAttendanceSettingsDto): Promise<AttendanceSettingsResponseDto> {
    await this.getRecord()
    const updated = await this.repository.updateAttendance(dto)
    return ((updated ?? (await this.getRecord())).attendance ?? DEFAULT_ATTENDANCE_SETTINGS) as AttendanceSettingsResponseDto
  }

  async getIntegrations(): Promise<IntegrationsSettingsResponseDto> {
    const record = await this.getRecord()
    return this.toIntegrationsResponse(record.integrations)
  }

  async updateIntegrations(dto: UpdateIntegrationsSettingsDto): Promise<IntegrationsSettingsResponseDto> {
    await this.getRecord()
    const updated = await this.repository.updateIntegrations(dto)
    return this.toIntegrationsResponse((updated ?? (await this.getRecord())).integrations)
  }

  private async getRecord(): Promise<SchoolSettingsDocument> {
    const existing = await this.repository.find()
    if (existing) return existing
    return this.repository.ensureExists()
  }

  private toIntegrationsResponse(
    integrations?: SchoolSettingsDocument['integrations'],
  ): IntegrationsSettingsResponseDto {
    const email = integrations?.email ?? DEFAULT_INTEGRATIONS_SETTINGS.email
    const sms = integrations?.sms ?? DEFAULT_INTEGRATIONS_SETTINGS.sms
    const whatsapp = integrations?.whatsapp ?? DEFAULT_INTEGRATIONS_SETTINGS.whatsapp
    const emailPassword = 'passwordEncrypted' in email ? email.passwordEncrypted : undefined
    const smsApiKey = 'apiKeyEncrypted' in sms ? sms.apiKeyEncrypted : undefined
    const whatsappApiKey = 'apiKeyEncrypted' in whatsapp ? whatsapp.apiKeyEncrypted : undefined

    return {
      email: {
        provider: email.provider,
        host: email.host,
        port: email.port,
        secure: email.secure,
        username: email.username,
        hasPassword: Boolean(emailPassword && emailPassword.length > 0),
        fromEmail: email.fromEmail,
        fromName: email.fromName,
      },
      sms: {
        provider: sms.provider,
        senderId: sms.senderId,
        dltEntityId: sms.dltEntityId,
        isConfigured: Boolean(smsApiKey && smsApiKey.length > 0),
      },
      whatsapp: {
        enabled: whatsapp.enabled,
        provider: whatsapp.provider,
        businessPhoneNumber: whatsapp.businessPhoneNumber,
        isConfigured: Boolean(whatsappApiKey && whatsappApiKey.length > 0),
      },
    }
  }

  private toResponse(doc: SchoolSettingsDocument): SchoolSettingsResponseDto {
    return {
      profile: doc.profile,
      system: doc.system,
      security: (doc.security ?? DEFAULT_SECURITY_SETTINGS) as SecuritySettingsResponseDto,
      attendance: (doc.attendance ?? DEFAULT_ATTENDANCE_SETTINGS) as AttendanceSettingsResponseDto,
      integrations: this.toIntegrationsResponse(doc.integrations),
      updatedAt: doc.updatedAt ?? new Date(),
    }
  }
}
