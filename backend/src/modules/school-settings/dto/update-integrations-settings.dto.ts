import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'
import {
  EMAIL_PROVIDERS,
  SMS_PROVIDERS,
  WHATSAPP_PROVIDERS,
  type EmailProvider,
  type SmsProvider,
  type WhatsAppProvider,
} from '../constants/school-settings.constants'

export class UpdateEmailIntegrationDto {
  @ApiProperty({ description: 'Email provider', enum: EMAIL_PROVIDERS, example: 'smtp' })
  @IsIn(EMAIL_PROVIDERS)
  provider: EmailProvider

  @ApiProperty({ description: 'SMTP host address', example: 'smtp.mailgun.org' })
  @IsString()
  host: string

  @ApiProperty({ description: 'SMTP port (1 to 65535)', example: 587 })
  @IsInt()
  @Min(1)
  @Max(65535)
  port: number

  @ApiProperty({ description: 'Use SSL/TLS secure transport', example: false })
  @IsBoolean()
  secure: boolean

  @ApiProperty({ description: 'SMTP username', example: 'postmaster@skooly.edu' })
  @IsString()
  username: string

  @ApiProperty({ description: 'New password for SMTP (leave blank to keep unchanged)', required: false })
  @IsOptional()
  @IsString()
  password?: string

  @ApiProperty({ description: 'Sender email address', example: 'notifications@skooly.edu' })
  @IsEmail()
  fromEmail: string

  @ApiProperty({ description: 'Sender display name', example: 'Skooly International Academy' })
  @IsString()
  fromName: string
}

export class UpdateSmsIntegrationDto {
  @ApiProperty({ description: 'SMS gateway provider', enum: SMS_PROVIDERS, example: 'disabled' })
  @IsIn(SMS_PROVIDERS)
  provider: SmsProvider

  @ApiProperty({ description: 'Sender ID approved with carrier', example: 'SKOOLY' })
  @IsString()
  @MaxLength(10)
  senderId: string

  @ApiProperty({ description: 'DLT Registered Principal Entity ID', example: '1101552390001' })
  @IsString()
  dltEntityId: string

  @ApiProperty({ description: 'API token or authentication key (leave blank to keep unchanged)', required: false })
  @IsOptional()
  @IsString()
  apiKey?: string
}

export class UpdateWhatsAppIntegrationDto {
  @ApiProperty({ description: 'Enable WhatsApp notification channel', example: false })
  @IsBoolean()
  enabled: boolean

  @ApiProperty({ description: 'WhatsApp Business provider', enum: WHATSAPP_PROVIDERS, example: 'disabled' })
  @IsIn(WHATSAPP_PROVIDERS)
  provider: WhatsAppProvider

  @ApiProperty({ description: 'Business registered telephone number', example: '+919876543210' })
  @IsString()
  businessPhoneNumber: string

  @ApiProperty({ description: 'API token or authentication key (leave blank to keep unchanged)', required: false })
  @IsOptional()
  @IsString()
  apiKey?: string
}

export class UpdateIntegrationsSettingsDto {
  @ApiProperty({ type: UpdateEmailIntegrationDto, description: 'Email delivery settings' })
  @ValidateNested()
  @Type(() => UpdateEmailIntegrationDto)
  email: UpdateEmailIntegrationDto

  @ApiProperty({ type: UpdateSmsIntegrationDto, description: 'SMS gateway settings' })
  @ValidateNested()
  @Type(() => UpdateSmsIntegrationDto)
  sms: UpdateSmsIntegrationDto

  @ApiProperty({ type: UpdateWhatsAppIntegrationDto, description: 'WhatsApp messaging settings' })
  @ValidateNested()
  @Type(() => UpdateWhatsAppIntegrationDto)
  whatsapp: UpdateWhatsAppIntegrationDto
}
