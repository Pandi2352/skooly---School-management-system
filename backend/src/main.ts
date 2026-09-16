import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { createValidationPipe } from './common/pipes/validation.pipe'
import { getCorsConfig } from './config/cors.config'
import { setupSwagger } from './config/swagger.config'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api'
  app.setGlobalPrefix(apiPrefix, { exclude: ['/', 'health', `${apiPrefix}/docs`] })

  // Every response follows one shape (common/interfaces/api-response.interface.ts):
  // success → { success: true, statusCode, message, data, meta?, path, timestamp }
  // error   → { success: false, statusCode, message, errorCode, errors, data: null, path, method, timestamp }
  app.useGlobalPipes(createValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)))
  app.useGlobalFilters(new AllExceptionsFilter())

  app.enableCors(getCorsConfig(configService))
  setupSwagger(app)
  app.enableShutdownHooks()

  const port = configService.get<number>('app.port') ?? 4000
  await app.listen(port)

  const swaggerPath = configService.get<string>('app.swaggerPath') ?? 'api/docs'
  logger.log(`Skooly ERP backend running on http://localhost:${port}/${apiPrefix}`)
  logger.log(`Swagger docs at http://localhost:${port}/${swaggerPath}`)
}

void bootstrap()
