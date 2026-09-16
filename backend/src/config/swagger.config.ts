import { INestApplication, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const logger = new Logger('SwaggerConfig')

/**
 * Initializes and binds Swagger / OpenAPI documentation to the NestJS application.
 *
 * @param app The NestJS application instance
 */
export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService)
  const isEnabled = configService.get<boolean>('app.swaggerEnabled') ?? true

  if (!isEnabled) {
    logger.log('Swagger documentation is disabled via environment configuration')
    return
  }

  const swaggerPath = configService.get<string>('app.swaggerPath') ?? 'api/docs'

  const config = new DocumentBuilder()
    .setTitle('Skooly School ERP API')
    .setDescription(
      'Comprehensive RESTful API for Skooly School ERP — single institution management with UUID primary keys.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health', 'Application and database health monitoring endpoints')
    .addTag('Core Setup & Administration', 'Academic sessions, sections, roles and institution setup')
    .addTag('Student Information', 'Student demographics, admissions, guardians and profiles')
    .addTag('Fees & Finance', 'Fee structures, collections, day-book, and ledger')
    .addTag('Academics', 'Examination records, timetables, and lesson plans')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Skooly School ERP - API Documentation',
  })

  logger.log(`Swagger OpenAPI documentation mounted at: /${swaggerPath}`)
}
