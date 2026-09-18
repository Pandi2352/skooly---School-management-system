import {
  DEFAULT_ATTENDANCE_SETTINGS,
  DEFAULT_INTEGRATIONS_SETTINGS,
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SYSTEM_SETTINGS,
} from './constants/school-settings.constants'
import { UpdateAttendanceSettingsDto } from './dto/update-attendance-settings.dto'
import { UpdateIntegrationsSettingsDto } from './dto/update-integrations-settings.dto'
import { UpdateSchoolProfileDto } from './dto/update-school-profile.dto'
import { UpdateSecuritySettingsDto } from './dto/update-security-settings.dto'
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto'
import { SchoolSettingsDocument } from './schemas/school-settings.schema'
import { SchoolSettingsRepository } from './school-settings.repository'
import { SchoolSettingsService } from './school-settings.service'

const mockSettingsDoc = {
  _id: 'school-settings-id',
  singletonKey: 'school_settings',
  profile: { ...DEFAULT_SCHOOL_PROFILE },
  system: { ...DEFAULT_SYSTEM_SETTINGS },
  security: { ...DEFAULT_SECURITY_SETTINGS },
  attendance: { ...DEFAULT_ATTENDANCE_SETTINGS },
  integrations: {
    email: { ...DEFAULT_INTEGRATIONS_SETTINGS.email, passwordEncrypted: 'smtp-secret-hash' },
    sms: { ...DEFAULT_INTEGRATIONS_SETTINGS.sms, apiKeyEncrypted: 'sms-secret-hash' },
    whatsapp: { ...DEFAULT_INTEGRATIONS_SETTINGS.whatsapp, apiKeyEncrypted: '' },
  },
  updatedAt: new Date('2026-01-01'),
  createdAt: new Date('2026-01-01'),
} as unknown as SchoolSettingsDocument

describe('SchoolSettingsService', () => {
  let service: SchoolSettingsService
  let repository: jest.Mocked<SchoolSettingsRepository>

  beforeEach(() => {
    repository = {
      find: jest.fn().mockResolvedValue(mockSettingsDoc),
      ensureExists: jest.fn().mockResolvedValue(mockSettingsDoc),
      updateProfile: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          ...mockSettingsDoc,
          profile: { ...mockSettingsDoc.profile, ...dto },
        } as SchoolSettingsDocument),
      ),
      updateSystem: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          ...mockSettingsDoc,
          system: { ...mockSettingsDoc.system, ...dto },
        } as SchoolSettingsDocument),
      ),
      updateSecurity: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          ...mockSettingsDoc,
          security: { ...mockSettingsDoc.security, ...dto },
        } as SchoolSettingsDocument),
      ),
      updateAttendance: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          ...mockSettingsDoc,
          attendance: { ...mockSettingsDoc.attendance, ...dto },
        } as SchoolSettingsDocument),
      ),
      updateIntegrations: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          ...mockSettingsDoc,
          integrations: {
            email: { ...mockSettingsDoc.integrations.email, ...dto.email },
            sms: { ...mockSettingsDoc.integrations.sms, ...dto.sms },
            whatsapp: { ...mockSettingsDoc.integrations.whatsapp, ...dto.whatsapp },
          },
        } as SchoolSettingsDocument),
      ),
    } as unknown as jest.Mocked<SchoolSettingsRepository>

    service = new SchoolSettingsService(repository)
  })

  it('ensures default settings record exists on initialization', async () => {
    await service.onModuleInit()
    expect(repository.ensureExists).toHaveBeenCalled()
  })

  it('fetches entire school settings record', async () => {
    const res = await service.getSettings()
    expect(res.profile.schoolName).toBe(DEFAULT_SCHOOL_PROFILE.schoolName)
    expect(res.system.currency).toBe(DEFAULT_SYSTEM_SETTINGS.currency)
    expect(res.security.sessionIdleMinutes).toBe(DEFAULT_SECURITY_SETTINGS.sessionIdleMinutes)
    expect(res.attendance.trackingMode).toBe('daily')
    expect(res.integrations.email.hasPassword).toBe(true)
    expect(res.updatedAt).toEqual(mockSettingsDoc.updatedAt)
    expect(repository.find).toHaveBeenCalled()
  })

  it('fetches school profile', async () => {
    const res = await service.getProfile()
    expect(res.schoolName).toBe(DEFAULT_SCHOOL_PROFILE.schoolName)
    expect(res.email).toBe(DEFAULT_SCHOOL_PROFILE.email)
  })

  it('updates school profile', async () => {
    const updateDto: UpdateSchoolProfileDto = {
      schoolName: 'New Horizon Academy',
      shortName: 'NHA',
      email: 'admin@newhorizon.edu',
      phone: '+91 91234 56789',
      principalName: 'Dr. Evelyn Reed',
      country: 'IN',
      address: '100 Innovation Way',
    }

    const res = await service.updateProfile(updateDto)
    expect(repository.updateProfile).toHaveBeenCalledWith(updateDto)
    expect(res.schoolName).toBe('New Horizon Academy')
    expect(res.shortName).toBe('NHA')
  })

  it('fetches system formats and sequences', async () => {
    const res = await service.getSystem()
    expect(res.schoolCode).toBe(DEFAULT_SYSTEM_SETTINGS.schoolCode)
    expect(res.currency).toBe('INR')
    expect(res.feeReceipt.prefix).toBe('SIA')
  })

  it('updates system numbering sequences', async () => {
    const updateDto: UpdateSystemSettingsDto = {
      ...DEFAULT_SYSTEM_SETTINGS,
      currency: 'AED',
      schoolCode: 'NHA-DXB-01',
    }

    const res = await service.updateSystem(updateDto)
    expect(repository.updateSystem).toHaveBeenCalledWith(updateDto)
    expect(res.currency).toBe('AED')
    expect(res.schoolCode).toBe('NHA-DXB-01')
  })

  it('fetches security settings', async () => {
    const res = await service.getSecurity()
    expect(res.sessionIdleMinutes).toBe(30)
    expect(res.passwordMinLength).toBe(8)
    expect(res.twoFactorEnforcement).toBe('optional')
  })

  it('updates security settings', async () => {
    const updateDto: UpdateSecuritySettingsDto = {
      ...DEFAULT_SECURITY_SETTINGS,
      sessionIdleMinutes: 45,
      passwordMinLength: 10,
      twoFactorEnforcement: 'required-admins',
    }

    const res = await service.updateSecurity(updateDto)
    expect(repository.updateSecurity).toHaveBeenCalledWith(updateDto)
    expect(res.sessionIdleMinutes).toBe(45)
    expect(res.passwordMinLength).toBe(10)
    expect(res.twoFactorEnforcement).toBe('required-admins')
  })

  it('fetches attendance settings', async () => {
    const res = await service.getAttendance()
    expect(res.trackingMode).toBe('daily')
    expect(res.saturdayRule).toBe('alternate')
    expect(res.checkInTime).toBe('08:30')
  })

  it('updates attendance settings', async () => {
    const updateDto: UpdateAttendanceSettingsDto = {
      ...DEFAULT_ATTENDANCE_SETTINGS,
      checkInTime: '08:45',
      minimumAttendancePercentage: 80,
    }

    const res = await service.updateAttendance(updateDto)
    expect(repository.updateAttendance).toHaveBeenCalledWith(updateDto)
    expect(res.checkInTime).toBe('08:45')
    expect(res.minimumAttendancePercentage).toBe(80)
  })

  it('fetches integrations settings and masks secrets', async () => {
    const res = await service.getIntegrations()
    expect(res.email.provider).toBe('smtp')
    expect(res.email.hasPassword).toBe(true)
    expect(res.sms.isConfigured).toBe(true)
    expect(res.whatsapp.isConfigured).toBe(false)
  })

  it('updates integrations settings', async () => {
    const updateDto: UpdateIntegrationsSettingsDto = {
      email: {
        provider: 'smtp',
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: true,
        username: 'apikey',
        fromEmail: 'alerts@newhorizon.edu',
        fromName: 'New Horizon Alerts',
      },
      sms: {
        provider: 'twilio',
        senderId: 'NHACAD',
        dltEntityId: '11002233',
      },
      whatsapp: {
        enabled: true,
        provider: 'interakt',
        businessPhoneNumber: '+919999988888',
      },
    }

    const res = await service.updateIntegrations(updateDto)
    expect(repository.updateIntegrations).toHaveBeenCalledWith(updateDto)
    expect(res.email.host).toBe('smtp.sendgrid.net')
    expect(res.sms.provider).toBe('twilio')
    expect(res.whatsapp.enabled).toBe(true)
  })
})
