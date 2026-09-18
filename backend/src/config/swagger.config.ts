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
      'RESTful API for Skooly School ERP: one school, UUID primary keys, cookie sign-in and role-based permissions.',
    )
    .setVersion('1.0.0')
    // Sign-in uses an httpOnly session cookie, not a bearer token: the browser sends it on its own
    // once POST /auth/login has answered.
    .addCookieAuth('skooly_session', {
      type: 'apiKey',
      in: 'cookie',
      name: 'skooly_session',
      description: 'Set by POST /auth/login. Sign in there first, then try the other endpoints.',
    })
    .addTag('Health', 'Application and database health monitoring endpoints')
    .addTag('Roles & Permissions', 'Staff roles and what each one can see and change')
    .addTag('Branding', 'School name, tagline, colour theme, logo, favicon, signature, seal and login image')
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
      // Send the session cookie, and the header the CSRF check asks for, so "Try it out" works.
      withCredentials: true,
      requestInterceptor: (request: { headers: Record<string, string> }) => {
        request.headers['X-Requested-With'] = 'XMLHttpRequest'
        return request
      },
    },
    customSiteTitle: 'Skooly School ERP - API Documentation',
  })

  logger.log(`Swagger OpenAPI documentation mounted at: /${swaggerPath}`)
}
