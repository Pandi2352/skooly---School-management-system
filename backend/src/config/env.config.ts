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
}

export default (): { app: AppEnvConfig } => {
  const corsOriginsRaw = process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173'
  const corsOrigins = corsOriginsRaw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  const port = parseInt(process.env.PORT || '4000', 10)

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
      publicBaseUrl: (process.env.PUBLIC_BASE_URL || `http://localhost:${port}`).replace(/\/+$/, ''),
    },
  }
}
