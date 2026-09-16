import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

const logger = new Logger('CorsConfig')

/**
 * Generates NestJS / Express CORS configuration derived directly from environment variables.
 *
 * @param configService The NestJS ConfigService instance
 * @returns CorsOptions ready to pass into app.enableCors()
 */
export function getCorsConfig(configService: ConfigService): CorsOptions {
  const corsOrigins = configService.get<string[]>('app.corsOrigins') ?? [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]
  const allowCredentials = configService.get<boolean>('app.corsCredentials') ?? true

  logger.log(`Configuring CORS with origins: [${corsOrigins.join(', ')}], credentials: ${allowCredentials}`)

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, Postman)
      if (!origin) {
        return callback(null, true)
      }

      // Check for wildcard '*'
      if (corsOrigins.includes('*')) {
        return callback(null, true)
      }

      // Check against explicit list
      const isAllowed = corsOrigins.some((allowed) => {
        // Direct string match
        if (allowed === origin) {
          return true
        }
        // Subdomain wildcard matching (e.g. *.example.com)
        if (allowed.startsWith('*.')) {
          const rootDomain = allowed.slice(2)
          return origin.endsWith(rootDomain)
        }
        return false
      })

      if (isAllowed) {
        callback(null, true)
      } else {
        logger.warn(`Blocked CORS request from origin: ${origin}`)
        callback(new Error(`CORS policy error: Origin ${origin} not allowed`), false)
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Custom-Header',
      'Cache-Control',
    ],
    exposedHeaders: ['Content-Range', 'X-Total-Count', 'Authorization'],
    credentials: allowCredentials,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }
}
