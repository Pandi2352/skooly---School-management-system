import { z } from 'zod'

export const emailIntegrationSchema = z.object({
  provider: z.enum(['smtp', 'disabled']),
  host: z.string(),
  port: z.number().int().min(1, 'Port must be at least 1').max(65535, 'Port cannot exceed 65535'),
  secure: z.boolean(),
  username: z.string(),
  password: z.string().optional(),
  hasPassword: z.boolean().optional(),
  fromEmail: z.email('Please enter a valid sender email address'),
  fromName: z.string().min(1, 'Sender display name is required'),
})

export const smsIntegrationSchema = z.object({
  provider: z.enum(['msg91', 'twilio', 'fast2sms', 'disabled']),
  senderId: z.string().max(10, 'Sender ID cannot exceed 10 characters'),
  dltEntityId: z.string(),
  apiKey: z.string().optional(),
  isConfigured: z.boolean().optional(),
})

export const whatsAppIntegrationSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(['interakt', 'gupshup', 'wati', 'disabled']),
  businessPhoneNumber: z.string(),
  apiKey: z.string().optional(),
  isConfigured: z.boolean().optional(),
})

export const integrationsSettingsSchema = z.object({
  email: emailIntegrationSchema,
  sms: smsIntegrationSchema,
  whatsapp: whatsAppIntegrationSchema,
})

export type EmailIntegration = z.infer<typeof emailIntegrationSchema>
export type SmsIntegration = z.infer<typeof smsIntegrationSchema>
export type WhatsAppIntegration = z.infer<typeof whatsAppIntegrationSchema>
export type IntegrationsSettingsFormData = z.infer<typeof integrationsSettingsSchema>
