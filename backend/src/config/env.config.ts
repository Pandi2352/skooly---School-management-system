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
}

export default (): { app: AppEnvConfig } => {
  const corsOriginsRaw = process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173'
  const corsOrigins = corsOriginsRaw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return {
    app: {
      port: parseInt(process.env.PORT || '4000', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
      apiPrefix: process.env.API_PREFIX || 'api',
      corsOrigins,
      corsCredentials: process.env.CORS_CREDENTIALS === 'true',
      mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skooly_erp',
      mongodbDbName: process.env.MONGODB_DB_NAME || 'skooly_erp',
      swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
      swaggerPath: process.env.SWAGGER_PATH || 'api/docs',
    },
  }
}
