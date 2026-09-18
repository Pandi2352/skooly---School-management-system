import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import helmet from 'helmet'
import type { NextFunction, Request, Response } from 'express'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { resolve } from 'node:path'
// cookie-parser exports the function itself, with no `default` on it. This project compiles
// without esModuleInterop, so a default import would emit `.default` and be undefined at run time.
import cookieParser = require('cookie-parser')
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { createValidationPipe } from './common/pipes/validation.pipe'
import { UPLOADS_ROUTE } from './common/storage/file-storage.interface'
import { assertProductionIsSafe } from './config/security.config'
import { getCorsConfig } from './config/cors.config'
import { setupSwagger } from './config/swagger.config'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  assertProductionIsSafe(configService, logger)

  // Behind a proxy or load balancer, the client's real address arrives in X-Forwarded-For. Trust it
  // only when told to: trusting it blindly lets anyone spoof the address the rate limiter counts.
  const trustProxy = configService.get<string>('app.trustProxy')
  if (trustProxy) app.set('trust proxy', trustProxy === 'true' ? 1 : trustProxy)

  // Security headers. The API answers with JSON, so the strict content policy costs nothing here;
  // /uploads sets its own headers further down.
  app.use(
    helmet({
      contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
      crossOriginResourcePolicy: false,
      referrerPolicy: { policy: 'no-referrer' },
    }),
  )

  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api'
  app.setGlobalPrefix(apiPrefix, { exclude: ['/', 'health', `${apiPrefix}/docs`] })

  // Every response follows one shape (common/interfaces/api-response.interface.ts):
  // success → { success: true, statusCode, message, data, meta?, path, timestamp }
  // error   → { success: false, statusCode, message, errorCode, errors, data: null, path, method, timestamp }
  // The session cookie is read on every request, so it has to be parsed before any guard runs.
  app.use(cookieParser())
  // Answers about people and permissions must not sit in a shared cache; images may.
  app.use((request: Request, response: Response, next: NextFunction) => {
    if (!request.path.startsWith(`${UPLOADS_ROUTE}/`)) response.setHeader('Cache-Control', 'no-store')
    next()
  })
  app.useGlobalPipes(createValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)))
  app.useGlobalFilters(new AllExceptionsFilter())

  // Uploaded files. Names are random UUIDs, so they can be cached for good. The headers stop an
  // uploaded file from running scripts or being treated as another type if opened directly.
  app.useStaticAssets(resolve(configService.get<string>('app.uploadDir') ?? 'uploads'), {
    prefix: `${UPLOADS_ROUTE}/`,
    index: false,
    dotfiles: 'deny',
    maxAge: '365d',
    immutable: true,
    setHeaders: (response) => {
      response.setHeader('X-Content-Type-Options', 'nosniff')
      response.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox")
      // The frontend runs on another origin and shows these images.
      response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
      response.setHeader('Access-Control-Allow-Origin', '*')
    },
  })


  app.enableCors(getCorsConfig(configService))
  setupSwagger(app)
  app.enableShutdownHooks()

  const port = configService.get<number>('app.port') ?? 4000
  await app.listen(port)

  const swaggerPath = configService.get<string>('app.swaggerPath') ?? 'api/docs'
  logger.log(`Skooly ERP backend running on http://localhost:${port}/${apiPrefix}`)
  logger.log(`Swagger docs at http://localhost:${port}/${swaggerPath}`)
  if (!configService.get<boolean>('app.authEnabled')) {
    logger.warn('AUTH_ENABLED is false: permission checks are off. Never run production like this.')
  }
  if (!configService.get<boolean>('mail.enabled')) {
    logger.warn('SMTP_HOST is empty: invitation and reset emails will be written to the log instead of sent.')
  }
}

void bootstrap()
