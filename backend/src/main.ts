import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { getCorsConfig } from './config/cors.config'
import { setupSwagger } from './config/swagger.config'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Global Prefix
  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api'
  app.setGlobalPrefix(apiPrefix, {
    exclude: ['/', 'health', `${apiPrefix}/docs`],
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // Dedicated CORS configuration from environment
  app.enableCors(getCorsConfig(configService))

  // Dedicated Swagger OpenAPI configuration
  setupSwagger(app)

  const port = configService.get<number>('app.port') ?? 4000
  await app.listen(port)

  const swaggerPath = configService.get<string>('app.swaggerPath') ?? 'api/docs'
  logger.log(`====================================================`)
  logger.log(`🚀 Skooly ERP Backend running on: http://localhost:${port}`)
  logger.log(`📖 Swagger API Docs available at: http://localhost:${port}/${swaggerPath}`)
  logger.log(`🛡️  CORS configured via: src/config/cors.config.ts`)
  logger.log(`🔑 Primary Keys: Standard UUIDv4 (No ObjectIds)`)
  logger.log(`====================================================`)
}

void bootstrap()
