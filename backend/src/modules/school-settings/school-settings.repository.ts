import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { generateUuid } from '../../common/utils/uuid.util'
import {
  DEFAULT_ATTENDANCE_SETTINGS,
  DEFAULT_INTEGRATIONS_SETTINGS,
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SYSTEM_SETTINGS,
  SCHOOL_SETTINGS_SINGLETON_KEY,
} from './constants/school-settings.constants'
import { UpdateAttendanceSettingsDto } from './dto/update-attendance-settings.dto'
import { UpdateIntegrationsSettingsDto } from './dto/update-integrations-settings.dto'
import { UpdateSchoolProfileDto } from './dto/update-school-profile.dto'
import { UpdateSecuritySettingsDto } from './dto/update-security-settings.dto'
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto'
import { SchoolSettings, SchoolSettingsDocument } from './schemas/school-settings.schema'

const SINGLETON = { singletonKey: SCHOOL_SETTINGS_SINGLETON_KEY }

@Injectable()
export class SchoolSettingsRepository {
  constructor(
    @InjectModel(SchoolSettings.name)
    private readonly settingsModel: Model<SchoolSettingsDocument>,
  ) {}

  async find(): Promise<SchoolSettingsDocument | null> {
    return this.settingsModel.findOne(SINGLETON).exec()
  }

  async ensureExists(): Promise<SchoolSettingsDocument> {
    const existing = await this.find()
    if (existing) {
      let needsSave = false
      if (!existing.security) {
        existing.security = DEFAULT_SECURITY_SETTINGS as unknown as typeof existing.security
        needsSave = true
      }
      if (!existing.attendance) {
        existing.attendance = DEFAULT_ATTENDANCE_SETTINGS as unknown as typeof existing.attendance
        needsSave = true
      }
      if (!existing.integrations) {
        existing.integrations = DEFAULT_INTEGRATIONS_SETTINGS as unknown as typeof existing.integrations
        needsSave = true
      }
      if (needsSave) {
        await existing.save()
      }
      return existing
    }

    return this.settingsModel.create({
      _id: generateUuid(),
      singletonKey: SCHOOL_SETTINGS_SINGLETON_KEY,
      profile: DEFAULT_SCHOOL_PROFILE,
      system: DEFAULT_SYSTEM_SETTINGS,
      security: DEFAULT_SECURITY_SETTINGS,
      attendance: DEFAULT_ATTENDANCE_SETTINGS,
      integrations: DEFAULT_INTEGRATIONS_SETTINGS,
    })
  }

  async updateProfile(profile: UpdateSchoolProfileDto): Promise<SchoolSettingsDocument | null> {
    return this.settingsModel
      .findOneAndUpdate(
        SINGLETON,
        {
          $set: {
            'profile.schoolName': profile.schoolName,
            'profile.shortName': profile.shortName ?? '',
            'profile.email': profile.email,
            'profile.phone': profile.phone ?? '',
            'profile.principalName': profile.principalName ?? '',
            'profile.country': profile.country,
            'profile.address': profile.address ?? '',
          },
        },
        { new: true, runValidators: true },
      )
      .exec()
  }

  async updateSystem(system: UpdateSystemSettingsDto): Promise<SchoolSettingsDocument | null> {
    return this.settingsModel
      .findOneAndUpdate(
        SINGLETON,
        {
          $set: {
            'system.schoolCode': system.schoolCode ?? '',
            'system.affiliatedBy': system.affiliatedBy ?? '',
            'system.currency': system.currency,
            'system.receiptTemplate': system.receiptTemplate,
            'system.feeReceipt': system.feeReceipt,
            'system.admission': system.admission,
            'system.roll': system.roll,
          },
        },
        { new: true, runValidators: true },
      )
      .exec()
  }

  async updateSecurity(security: UpdateSecuritySettingsDto): Promise<SchoolSettingsDocument | null> {
    return this.settingsModel
      .findOneAndUpdate(
        SINGLETON,
        {
          $set: {
            'security.sessionIdleMinutes': security.sessionIdleMinutes,
            'security.rememberMeEnabled': security.rememberMeEnabled,
            'security.rememberMeDays': security.rememberMeDays,
            'security.maxLoginAttempts': security.maxLoginAttempts,
            'security.lockoutDurationMinutes': security.lockoutDurationMinutes,
            'security.passwordMinLength': security.passwordMinLength,
            'security.requireSpecialChar': security.requireSpecialChar,
            'security.requireNumber': security.requireNumber,
            'security.requireUppercase': security.requireUppercase,
            'security.twoFactorEnforcement': security.twoFactorEnforcement,
          },
        },
        { new: true, runValidators: true },
      )
      .exec()
  }

  async updateAttendance(attendance: UpdateAttendanceSettingsDto): Promise<SchoolSettingsDocument | null> {
    return this.settingsModel
      .findOneAndUpdate(
        SINGLETON,
        {
          $set: {
            'attendance.trackingMode': attendance.trackingMode,
            'attendance.workingDays': attendance.workingDays,
            'attendance.saturdayRule': attendance.saturdayRule,
            'attendance.checkInTime': attendance.checkInTime,
            'attendance.lateThresholdMinutes': attendance.lateThresholdMinutes,
            'attendance.halfDayThresholdHours': attendance.halfDayThresholdHours,
            'attendance.minimumAttendancePercentage': attendance.minimumAttendancePercentage,
            'attendance.notifyAbsenceToParents': attendance.notifyAbsenceToParents,
            'attendance.absenceNotificationTime': attendance.absenceNotificationTime,
          },
        },
        { new: true, runValidators: true },
      )
      .exec()
  }

  async updateIntegrations(dto: UpdateIntegrationsSettingsDto): Promise<SchoolSettingsDocument | null> {
    const updateFields: Record<string, unknown> = {
      'integrations.email.provider': dto.email.provider,
      'integrations.email.host': dto.email.host ?? '',
      'integrations.email.port': dto.email.port,
      'integrations.email.secure': dto.email.secure,
      'integrations.email.username': dto.email.username ?? '',
      'integrations.email.fromEmail': dto.email.fromEmail,
      'integrations.email.fromName': dto.email.fromName,
      'integrations.sms.provider': dto.sms.provider,
      'integrations.sms.senderId': dto.sms.senderId ?? '',
      'integrations.sms.dltEntityId': dto.sms.dltEntityId ?? '',
      'integrations.whatsapp.enabled': dto.whatsapp.enabled,
      'integrations.whatsapp.provider': dto.whatsapp.provider,
      'integrations.whatsapp.businessPhoneNumber': dto.whatsapp.businessPhoneNumber ?? '',
    }

    if (dto.email.password && dto.email.password.trim().length > 0) {
      updateFields['integrations.email.passwordEncrypted'] = dto.email.password.trim()
    }
    if (dto.sms.apiKey && dto.sms.apiKey.trim().length > 0) {
      updateFields['integrations.sms.apiKeyEncrypted'] = dto.sms.apiKey.trim()
    }
    if (dto.whatsapp.apiKey && dto.whatsapp.apiKey.trim().length > 0) {
      updateFields['integrations.whatsapp.apiKeyEncrypted'] = dto.whatsapp.apiKey.trim()
    }

    return this.settingsModel
      .findOneAndUpdate(
        SINGLETON,
        { $set: updateFields },
        { new: true, runValidators: true },
      )
      .exec()
  }
}
