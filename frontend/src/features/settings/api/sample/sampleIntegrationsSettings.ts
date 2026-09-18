import type { IntegrationsSettings } from '../../types/settings.types'

let integrations: IntegrationsSettings = {
  email: {
    provider: 'smtp',
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    username: 'postmaster@skooly.edu',
    hasPassword: true,
    fromEmail: 'notifications@skooly.edu',
    fromName: 'Skooly International Academy',
  },
  sms: {
    provider: 'disabled',
    senderId: 'SKOOLY',
    dltEntityId: '',
    isConfigured: false,
  },
  whatsapp: {
    enabled: false,
    provider: 'disabled',
    businessPhoneNumber: '',
    isConfigured: false,
  },
}

export const readSampleIntegrationsSettings = (): IntegrationsSettings => integrations

export function writeSampleIntegrationsSettings(next: IntegrationsSettings): IntegrationsSettings {
  integrations = next
  return integrations
}
