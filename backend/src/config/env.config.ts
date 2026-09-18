export interface AppEnvConfig {
  port: number
  nodeEnv: string
  apiPrefix: string
  corsOrigins: string[]
  corsCredentials: boolean
  mongodbUri: string
  mongodbDbName: string
  swaggerEnabled: boolean
  swaggerPath: string
  /** Permission checks run only when true. Keep false until the login module sets request.user. */
  authEnabled: boolean
  /** Folder for uploaded files (created on first upload); relative paths resolve from the process cwd. */
  uploadDir: string
  /** Public origin of this API, used to build file URLs, e.g. https://api.school.in (no trailing slash). */
  publicBaseUrl: string
  /** Where the web app runs. Invitation and password links in emails point here (no trailing slash). */
  appUrl: string
}

export interface AuthEnvConfig {
  /** Name of the session cookie the browser sends back on every request. */
  cookieName: string
  /** Cookie domain, when the API and the web app share a parent domain. Empty means host-only. */
  cookieDomain: string
  /** Signed out after this long without a request. */
  sessionIdleMinutes: number
  /** A session never lives longer than this, even when used every day. */
  sessionAbsoluteDays: number
  /** Idle limit for a session started with "keep me signed in". */
  rememberMeIdleDays: number
  /** Wrong passwords in a row before the account locks. */
  loginMaxAttempts: number
  /** How long the account stays locked after that. */
  loginLockMinutes: number
  /** How long an invitation link works. */
  invitationExpiryHours: number
  /** How long a password reset link works. */
  resetExpiryMinutes: number
}

export interface MailEnvConfig {
  host: string
  port: number
  /** True for port 465 (implicit TLS); port 587 upgrades with STARTTLS instead. */
  secure: boolean
  user: string
  password: string
  /** From header, e.g. "Skooly <office@school.in>". */
  from: string
  /** False when SMTP_HOST is empty: emails are logged instead of sent, so development still works. */
  enabled: boolean
}

const toInt = (value: string | undefined, fallback: number): number => {
  const parsed = parseInt(value ?? '', 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, '')

export default (): { app: AppEnvConfig; auth: AuthEnvConfig; mail: MailEnvConfig } => {
  const corsOriginsRaw = process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173'
  const corsOrigins = corsOriginsRaw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  const port = toInt(process.env.PORT, 4000)
  const smtpPort = toInt(process.env.SMTP_PORT, 587)
  const smtpHost = (process.env.SMTP_HOST || '').trim()
  const smtpUser = (process.env.SMTP_USER || '').trim()

  return {
    app: {
      port,
      nodeEnv: process.env.NODE_ENV || 'development',
      apiPrefix: process.env.API_PREFIX || 'api',
      corsOrigins,
      corsCredentials: process.env.CORS_CREDENTIALS === 'true',
      mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skooly_erp',
      mongodbDbName: process.env.MONGODB_DB_NAME || 'skooly_erp',
      swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
      swaggerPath: process.env.SWAGGER_PATH || 'api/docs',
      authEnabled: process.env.AUTH_ENABLED === 'true',
      uploadDir: process.env.UPLOAD_DIR || 'uploads',
      publicBaseUrl: stripTrailingSlash(process.env.PUBLIC_BASE_URL || `http://localhost:${port}`),
      appUrl: stripTrailingSlash(process.env.APP_URL || corsOrigins[0] || 'http://localhost:5173'),
    },
    auth: {
      cookieName: process.env.SESSION_COOKIE_NAME || 'skooly_session',
      cookieDomain: (process.env.SESSION_COOKIE_DOMAIN || '').trim(),
      sessionIdleMinutes: toInt(process.env.SESSION_IDLE_MINUTES, 720),
      sessionAbsoluteDays: toInt(process.env.SESSION_ABSOLUTE_DAYS, 30),
      rememberMeIdleDays: toInt(process.env.SESSION_REMEMBER_ME_DAYS, 30),
      loginMaxAttempts: toInt(process.env.LOGIN_MAX_ATTEMPTS, 5),
      loginLockMinutes: toInt(process.env.LOGIN_LOCK_MINUTES, 15),
      invitationExpiryHours: toInt(process.env.INVITATION_EXPIRY_HOURS, 72),
      resetExpiryMinutes: toInt(process.env.PASSWORD_RESET_EXPIRY_MINUTES, 60),
    },
    mail: {
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : smtpPort === 465,
      user: smtpUser,
      password: process.env.SMTP_PASS || '',
      from: process.env.MAIL_FROM || smtpUser,
      enabled: smtpHost.length > 0,
    },
  }
}
